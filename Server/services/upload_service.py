import os
import uuid
import logging
import json
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException

from utils.zip_validator import validate_zip_file, is_valid_zip_extension
from services.storage_service import StorageService
from services.metadata_service import MetadataService
from Parser.repository_parser import parse_repository
from services.graph_service import GraphService
from graph_engine.graph_serializer import GraphSerializer

class UploadService:
    def __init__(self):
        self.storage_service = StorageService()
        self.metadata_service = MetadataService()

    def _setup_workspace_logger(self, workspace_path: Path) -> logging.Logger:
        logger = logging.getLogger(f"parser_{workspace_path.name}")
        logger.setLevel(logging.INFO)
        
        # Clean existing handlers
        logger.handlers = []
        
        log_file = workspace_path / "logs" / "parser.log"
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

        # 2. Setup initial repository document with UPLOADING status
        repo_uuid = uuid.uuid4().hex
        repo_id = f"repo_{repo_uuid}"
        
        try:
            self.metadata_service.create_initial_record(repo_id, repository_name)
        except Exception as db_err:
            raise HTTPException(status_code=500, detail=f"Database initialization error: {str(db_err)}")

        # 3. Setup temporary upload directory
        temp_dir = self.storage_service.create_temp_upload_dir()
        temp_zip_path = temp_dir / "repository.zip"

        try:
            # 4. Store ZIP file temporarily
            with open(temp_zip_path, "wb") as buffer:
                while content := await file.read(1024 * 1024):
                    buffer.write(content)
            
            # 5. Validate ZIP file
            is_valid, validation_msg = validate_zip_file(temp_zip_path)
            if not is_valid:
                self.storage_service.cleanup_temp_dir(temp_dir)
                self.metadata_service.update_repository_status(
                    repo_id=repo_id,
                    status="FAILED",
                    stage="UPLOADING",
                    error=validation_msg
                )
                raise HTTPException(status_code=400, detail=validation_msg)

            # 6. Set status to EXTRACTING & Create workspace
            self.metadata_service.update_repository_status(
                repo_id=repo_id,
                status="EXTRACTING",
                stage="EXTRACTING"
            )
            
            workspace_path, source_dir = self.storage_service.create_repo_workspace(repo_id)

            # Initialize workspace logging
            logger = self._setup_workspace_logger(workspace_path)
            logger.info("Upload started for repository: %s (ID: %s)", repository_name, repo_id)
            logger.info("ZIP validation successful: %s", validation_msg)
            
            # Extract ZIP
            logger.info("Extracting repository ZIP...")
            source_root = self.storage_service.extract_zip(temp_zip_path, source_dir)
            logger.info("Extraction completed. Actual codebase root: %s", source_root)

            # 7. Set status to PARSING & Call Parser
            self.metadata_service.update_repository_status(
                repo_id=repo_id,
                status="PARSING",
                stage="PARSING"
            )
            
            logger.info("Calling AST parser on repository path: %s", source_root)
            try:
                metadata = parse_repository(str(source_root.resolve()))
                logger.info("AST parsing completed successfully")
            except Exception as pe:
                logger.error("AST parsing failed with error: %s", str(pe))
                self.metadata_service.update_repository_status(
                    repo_id=repo_id,
                    status="FAILED",
                    stage="PARSING",
                    error=str(pe)
                )
                # Clean up workspace on parser error
                shutil.rmtree(workspace_path, ignore_errors=True)
                raise HTTPException(status_code=500, detail=f"Codebase parsing error: {str(pe)}")

            # 8. Save metadata.json
            logger.info("Saving repository metadata.json...")
            metadata_path = self.metadata_service.serialize_and_save(metadata, workspace_path)
            logger.info("Metadata saved at: %s", metadata_path)

            # 9. Set status to GENERATING_GRAPH & Generate Module Graph
            self.metadata_service.update_repository_status(
                repo_id=repo_id,
                status="GENERATING_GRAPH",
                stage="GENERATING_GRAPH",
                parser_status="READY"
            )
            
            logger.info("Generating module dependencies graph...")
            graph_json_path = workspace_path / "graph" / "graph.json"
            
            try:
                graph = GraphService.build_repository_graph(metadata_path)
                graph_data = GraphSerializer.to_json(graph)
                GraphService.save_graph(graph_data, graph_json_path)
                logger.info("Module graph generated successfully at: %s", graph_json_path)
            except Exception as ge:
                logger.error("Module graph generation failed: %s", str(ge))
                self.metadata_service.update_repository_status(
                    repo_id=repo_id,
                    status="FAILED",
                    stage="GENERATING_GRAPH",
                    error=str(ge),
                    graph_status="FAILED"
                )
                raise HTTPException(status_code=500, detail=f"Graph generation error: {str(ge)}")

            # 10. Calculate stats, prepare relative storage paths & mark READY in MongoDB
            logger.info("Calculating codebase stats metrics...")
            stats = self.metadata_service.calculate_statistics(metadata)
            
            repo_workspace_rel = f"storage/repositories/{repo_id}"
            storage_paths = {
                "source": f"{repo_workspace_rel}/source",
                "metadata": f"{repo_workspace_rel}/parser/metadata.json",
                "graph": f"{repo_workspace_rel}/graph/graph.json",
                "chunks": f"{repo_workspace_rel}/retrieval/chunks.json",
                "faiss": f"{repo_workspace_rel}/retrieval/vector_index.faiss",
                "mapping": f"{repo_workspace_rel}/retrieval/id_mapping.json"
            }

            from datetime import datetime
            graph_metadata = {
                "status": "READY",
                "generated_at": datetime.utcnow().isoformat(),
                "storage_path": f"{repo_workspace_rel}/graph/graph.json",
                "node_count": len(graph.nodes),
                "edge_count": len(graph.edges)
            }

            logger.info("Finalizing database record configuration...")
            try:
                self.metadata_service.update_repository_status(
                    repo_id=repo_id,
                    status="READY",
                    stage="READY",
                    statistics=stats,
                    storage_paths=storage_paths,
                    graph=graph_metadata,
                    parser_status="READY",
                    graph_status="READY",
                    retrieval_status="PENDING",
                    execution_flow_status="PENDING",
                    workspace_path=str(workspace_path.resolve())
                )
                # Save backward compatibility fields as well
                self.metadata_service.save_repository_record(
                    repo_id=repo_id,
                    repo_name=repository_name,
                    workspace_path=workspace_path,
                    metadata_path=metadata_path,
                    statistics=stats
                )
                logger.info("MongoDB record finalized successfully")
            except Exception as me:
                logger.error("MongoDB finalization failed: %s", str(me))
                raise HTTPException(status_code=500, detail=f"Database finalized updates error: {str(me)}")

            # 11. Cleanup temporary directories
            logger.info("Cleaning up temporary upload directories...")
            self.storage_service.cleanup_temp_dir(temp_dir)
            logger.info("Upload and ingestion cycle completed successfully")

            return {
                "success": True,
                "repository_id": repo_id,
                "repository_name": repository_name,
                "status": "READY",
                "statistics": stats
            }

        except HTTPException:
            # Re-raise HTTP exceptions to preserve correct status codes
            raise
        except Exception as e:
            # Fallback cleanup and status reporting on unexpected exceptions
            self.storage_service.cleanup_temp_dir(temp_dir)
            self.metadata_service.update_repository_status(
                repo_id=repo_id,
                status="FAILED",
                stage="FAILED",
                error=str(e)
            )
            raise HTTPException(status_code=500, detail=f"Ingestion pipeline failed: {str(e)}")
