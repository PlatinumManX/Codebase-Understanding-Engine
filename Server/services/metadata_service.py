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
        
        # Save to metadata.json
        json_path = target_path / "metadata.json"
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

    def save_repository_record(self, repo_id: str, repo_name: str, workspace_path: Path, metadata_path: Path, statistics: dict, language: str = "Python") -> str:
        collection = self.db["repositories"]
        
        record = {
            "repository_id": repo_id,
            "repository_name": repo_name,
            "status": "parsed",
            "storage_path": str(workspace_path.resolve()),
            "metadata_path": str(metadata_path.resolve()),
            "language": language,
            "statistics": statistics,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Update if exists, else insert
        collection.update_one(
            {"repository_id": repo_id},
            {"$set": record},
            upsert=True
        )
        
        return repo_id
