import os
import json
import dataclasses
from datetime import datetime
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

# Load ENV variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "codemap_ai")

class MetadataService:
    def __init__(self):
        # Initialize MongoDB connection lazily to ensure app starts even if local Mongo is loading
        self._client = None
        self._db = None

    @property
    def db(self):
        if self._db is None:
            self._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
            self._db = self._client[DATABASE_NAME]
        return self._db

    def serialize_and_save(self, metadata, target_path: Path) -> Path:
        # Convert dataclasses to dict
        meta_dict = dataclasses.asdict(metadata)
        
        # Save to parser/metadata.json
        json_path = target_path / "parser" / "metadata.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(meta_dict, f, indent=2, ensure_ascii=False)
            
        return json_path

    def calculate_statistics(self, metadata) -> dict:
        total_files = len(metadata.files)
        total_classes = sum(len(f.classes) for f in metadata.files)
        total_functions = sum(len(f.functions) for f in metadata.files)
        total_routes = sum(len(f.routes) for f in metadata.files)
        
        # Modules is count of source files parsed
        total_modules = total_files
        
        return {
            "files": total_files,
            "classes": total_classes,
            "functions": total_functions,
            "modules": total_modules,
            "routes": total_routes
        }

    def create_initial_record(self, repo_id: str, repo_name: str, status: str = "UPLOADING", stage: str = "UPLOADING") -> str:
        collection = self.db["repositories"]
        record = {
            "repository_id": repo_id,
            "repository_name": repo_name,
            "description": "",
            "language": "Python",
            "status": status,
            "processing_stage": stage,
            "parser_status": "PENDING",
            "graph_status": "PENDING",
            "retrieval_status": "PENDING",
            "execution_flow_status": "PENDING",
            "statistics": {
                "files": 0,
                "functions": 0,
                "classes": 0,
                "modules": 0,
                "routes": 0
            },
            "storage_paths": {},
            "active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        collection.update_one(
            {"repository_id": repo_id},
            {"$set": record},
            upsert=True
        )
        return repo_id

    def update_repository_status(self, repo_id: str, status: str, stage: str, statistics: dict = None, storage_paths: dict = None, error: str = None, **kwargs):
        collection = self.db["repositories"]
        update_doc = {
            "status": status,
            "processing_stage": stage,
            "updated_at": datetime.utcnow()
        }
        if statistics is not None:
            update_doc["statistics"] = statistics
        if storage_paths is not None:
            update_doc["storage_paths"] = storage_paths
        if error is not None:
            update_doc["error"] = error
            
        # Support any additional status updates like parser_status, graph_status, etc.
        for key, value in kwargs.items():
            if value is not None:
                update_doc[key] = value
            
        collection.update_one(
            {"repository_id": repo_id},
            {"$set": update_doc}
        )

    def save_repository_record(self, repo_id: str, repo_name: str, workspace_path: Path, metadata_path: Path, statistics: dict, language: str = "Python") -> str:
        # Keep this method for backward compatibility in case other scripts reference it
        collection = self.db["repositories"]
        
        # Calculate relative paths to not expose direct filesystem paths to front-end
        repo_workspace_rel = f"storage/repositories/{repo_id}"
        storage_paths = {
            "source": f"{repo_workspace_rel}/source",
            "metadata": f"{repo_workspace_rel}/parser/metadata.json",
            "graph": f"{repo_workspace_rel}/graph/graph.json",
            "chunks": f"{repo_workspace_rel}/retrieval/chunks.json",
            "faiss": f"{repo_workspace_rel}/retrieval/vector_index.faiss",
            "mapping": f"{repo_workspace_rel}/retrieval/id_mapping.json"
        }

        record = {
            "repository_id": repo_id,
            "repository_name": repo_name,
            "description": "",
            "status": "READY",
            "processing_stage": "READY",
            "parser_status": "READY",
            "graph_status": "READY",
            "retrieval_status": "PENDING",
            "execution_flow_status": "PENDING",
            "workspace_path": str(workspace_path.resolve()),
            "storage_path": str(workspace_path.resolve()),  # keeping for legacy compat
            "metadata_path": str(metadata_path.resolve()),  # keeping for legacy compat
            "storage_paths": storage_paths,
            "language": language,
            "statistics": statistics,
            "active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        collection.update_one(
            {"repository_id": repo_id},
            {"$set": record},
            upsert=True
        )
        
        return repo_id
