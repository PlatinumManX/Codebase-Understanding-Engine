import os
import uuid
import logging
from pathlib import Path
from fastapi import UploadFile, HTTPException

from utils.zip_validator import validate_zip_file, is_valid_zip_extension
from services.storage_service import StorageService
from services.metadata_service import MetadataService
from Parser.repository_parser import parse_repository

class UploadService:
    def __init__(self):
        self.storage_service = StorageService()
        self.metadata_service = MetadataService()

    def _setup_workspace_logger(self, workspace_path: Path) -> logging.Logger:
        logger = logging.getLogger(f"parser_{workspace_path.name}")
        logger.setLevel(logging.INFO)
        
        # Clean existing handlers
        logger.handlers = []
        
        log_file = workspace_path / "parser.log"
        fh = logging.FileHandler(log_file, encoding='utf-8')
        fh.setLevel(logging.INFO)
        
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        logger.addHandler(fh)
        
        return logger

    async def handle_zip_upload(self, repository_name: str, file: UploadFile) -> dict:
        # 1. Check extension
        if not is_valid_zip_extension(file.filename):
            raise HTTPException(status_code=400, detail="Only ZIP archives (.zip) are supported")

        # 2. Setup temporary upload directory
        temp_dir = self.storage_service.create_temp_upload_dir()
        temp_zip_path = temp_dir / "repository.zip"

        try:
            # 3. Store ZIP file temporarily
            with open(temp_zip_path, "wb") as buffer:
                shutil_copy = True
                # Chunked write to avoid high memory usage on large file uploads
                while content := await file.read(1024 * 1024):
                    buffer.write(content)
            
            # 4. Validate ZIP file
            is_valid, validation_msg = validate_zip_file(temp_zip_path)
            if not is_valid:
                self.storage_service.cleanup_temp_dir(temp_dir)
                raise HTTPException(status_code=400, detail=validation_msg)

            # 5. Generate Repository ID & Workspace
            repo_uuid = uuid.uuid4().hex
            repo_id = f"repo_{repo_uuid}"
            
            workspace_path, source_dir = self.storage_service.create_repo_workspace(repo_id)

            # 6. Initialize workspace logging
            logger = self._setup_workspace_logger(workspace_path)
            logger.info("Upload started for repository: %s", repository_name)
            logger.info("ZIP validation successful: %s", validation_msg)
            
            # 7. Extract ZIP
            logger.info("Extracting repository ZIP...")
            source_root = self.storage_service.extract_zip(temp_zip_path, source_dir)
            logger.info("Extraction completed. Actual codebase root: %s", source_root)

            # 8. Call Parser
            logger.info("Calling AST parser on repository path: %s", source_root)
            try:
                metadata = parse_repository(str(source_root.resolve()))
                logger.info("AST parsing completed successfully")
            except Exception as pe:
                logger.error("AST parsing failed with error: %s", str(pe))
                # Clean up workspace on parser error
                shutil.rmtree(workspace_path, ignore_errors=True)
                raise HTTPException(status_code=500, detail=f"Codebase parsing error: {str(pe)}")

            # 9. Serialize and save metadata.json
            logger.info("Saving repository metadata.json...")
            metadata_path = self.metadata_service.serialize_and_save(metadata, workspace_path)
            logger.info("Metadata saved at: %s", metadata_path)

            # 10. Calculate stats and insert/update MongoDB record
            logger.info("Calculating codebase stats metrics...")
            stats = self.metadata_service.calculate_statistics(metadata)
            
            logger.info("Storing repository information in MongoDB...")
            try:
                self.metadata_service.save_repository_record(
                    repo_id=repo_id,
                    repo_name=repository_name,
                    workspace_path=workspace_path,
                    metadata_path=metadata_path,
                    statistics=stats
                )
                logger.info("MongoDB record saved successfully")
            except Exception as me:
                logger.error("MongoDB storage failed with error: %s", str(me))
                # We can choose to fail the request if MongoDB fails
                raise HTTPException(status_code=500, detail=f"Database storage error: {str(me)}")

            # 11. Cleanup temporary directories
            logger.info("Cleaning up temporary upload directories...")
            self.storage_service.cleanup_temp_dir(temp_dir)
            logger.info("Upload and ingestion cycle completed successfully")

            return {
                "success": True,
                "repository_id": repo_id,
                "repository_name": repository_name,
                "status": "parsed",
                "statistics": stats
            }

        except HTTPException:
            # Re-raise HTTP exceptions to preserve correct status codes
            raise
        except Exception as e:
            # Fallback cleanup on unexpected exceptions
            self.storage_service.cleanup_temp_dir(temp_dir)
            raise HTTPException(status_code=500, detail=f"Ingestion pipeline failed: {str(e)}")
