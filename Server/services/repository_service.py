import os
import shutil
from datetime import datetime
from pathlib import Path
from fastapi import HTTPException
from services.metadata_service import MetadataService
from services.graph_service import GraphService
from graph_engine.graph_serializer import GraphSerializer

class RepositoryService:
    def __init__(self):
        self.metadata_service = MetadataService()

    @property
    def db(self):
        return self.metadata_service.db

    def get_all_repositories(self) -> list:
        collection = self.db["repositories"]
        # Find all active repositories, sorted by created_at desc
        cursor = collection.find({"active": True}).sort("created_at", -1)
        
        repos = []
        for doc in cursor:
            repos.append({
                "repository_id": doc.get("repository_id"),
                "repository_name": doc.get("repository_name"),
                "description": doc.get("description", ""),
                "language": doc.get("language", "Python"),
                "status": doc.get("status"),
                "processing_stage": doc.get("processing_stage"),
                "parser_status": doc.get("parser_status", "PENDING"),
                "graph_status": doc.get("graph_status", "PENDING"),
                "retrieval_status": doc.get("retrieval_status", "PENDING"),
                "execution_flow_status": doc.get("execution_flow_status", "PENDING"),
                "statistics": doc.get("statistics", {}),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
                "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None
            })
        return repos

    def get_active_repository(self) -> dict:
        collection = self.db["repositories"]
        doc = collection.find_one({"status": "READY", "active": True}, sort=[("created_at", -1)])
        if not doc:
            doc = collection.find_one({"status": "READY"}, sort=[("created_at", -1)])
            
        if not doc:
            raise HTTPException(status_code=404, detail="No active repository found")
            
        return {
            "repository_id": doc.get("repository_id"),
            "repository_name": doc.get("repository_name"),
            "description": doc.get("description", ""),
            "language": doc.get("language", "Python"),
            "status": doc.get("status"),
            "processing_stage": doc.get("processing_stage"),
            "statistics": doc.get("statistics", {}),
            "storage_paths": doc.get("storage_paths", {}),
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None
        }

    def get_repository_by_id(self, repo_id: str) -> dict:
        collection = self.db["repositories"]
        doc = collection.find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        return {
            "repository_id": doc.get("repository_id"),
            "repository_name": doc.get("repository_name"),
            "description": doc.get("description", ""),
            "language": doc.get("language", "Python"),
            "status": doc.get("status"),
            "processing_stage": doc.get("processing_stage"),
            "parser_status": doc.get("parser_status", "PENDING"),
            "graph_status": doc.get("graph_status", "PENDING"),
            "retrieval_status": doc.get("retrieval_status", "PENDING"),
            "execution_flow_status": doc.get("execution_flow_status", "PENDING"),
            "statistics": doc.get("statistics", {}),
            "storage_paths": doc.get("storage_paths", {}),
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None
        }

    def update_repository(self, repo_id: str, update_data: dict) -> dict:
        collection = self.db["repositories"]
        doc = collection.find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        # Filter only allowed editable fields
        allowed_fields = ["repository_name", "description", "tags", "version", "language"]
        filtered_updates = {k: v for k, v in update_data.items() if k in allowed_fields}
        
        if not filtered_updates:
            return self.get_repository_by_id(repo_id)
            
        filtered_updates["updated_at"] = datetime.utcnow()
        
        collection.update_one(
            {"repository_id": repo_id},
            {"$set": filtered_updates}
        )
        
        return self.get_repository_by_id(repo_id)

    def delete_repository(self, repo_id: str) -> dict:
        collection = self.db["repositories"]
        doc = collection.find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        # 1. Delete MongoDB record
        collection.delete_one({"repository_id": repo_id})
        
        # 2. Delete repository workspace folder safely
        base_repos_path = Path(__file__).resolve().parent.parent / "storage" / "repositories"
        workspace_path = base_repos_path / repo_id
        
        if workspace_path.exists() and workspace_path.is_dir():
            try:
                shutil.rmtree(workspace_path)
            except Exception:
                pass
                
        return {
            "success": True,
            "message": f"Repository {repo_id} deleted successfully from database and file storage"
        }

    def load_repository_graph(self, repo_id: str) -> dict:
        doc = self.db["repositories"].find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        workspace_path = Path(doc.get("workspace_path"))
        graph_json_path = workspace_path / "graph" / "graph.json"
        
        if not graph_json_path.exists():
            raise HTTPException(status_code=404, detail="Graph not generated for this repository")
            
        return GraphService.load_graph(graph_json_path)

    def get_graph_statistics(self, repo_id: str) -> dict:
        doc = self.db["repositories"].find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        graph_meta = doc.get("graph", {})
        return {
            "status": graph_meta.get("status", "PENDING"),
            "generated_at": graph_meta.get("generated_at"),
            "node_count": graph_meta.get("node_count", 0),
            "edge_count": graph_meta.get("edge_count", 0),
            "statistics": doc.get("statistics", {})
        }

    def get_module_subgraph(self, repo_id: str, module: str) -> dict:
        doc = self.db["repositories"].find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        workspace_path = Path(doc.get("workspace_path"))
        metadata_path = workspace_path / "parser" / "metadata.json"
        
        if not metadata_path.exists():
            raise HTTPException(status_code=404, detail="Metadata not parsed for this repository")
            
        subgraph = GraphService.build_module_graph(metadata_path, module)
        return GraphSerializer.to_json(subgraph)

    def get_function_subgraph(self, repo_id: str, function: str) -> dict:
        doc = self.db["repositories"].find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        workspace_path = Path(doc.get("workspace_path"))
        metadata_path = workspace_path / "parser" / "metadata.json"
        
        if not metadata_path.exists():
            raise HTTPException(status_code=404, detail="Metadata not parsed for this repository")
            
        subgraph = GraphService.build_function_graph(metadata_path, function)
        return GraphSerializer.to_json(subgraph)

    def get_route_subgraph(self, repo_id: str, route: str) -> dict:
        doc = self.db["repositories"].find_one({"repository_id": repo_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        workspace_path = Path(doc.get("workspace_path"))
        metadata_path = workspace_path / "parser" / "metadata.json"
        
        if not metadata_path.exists():
            raise HTTPException(status_code=404, detail="Metadata not parsed for this repository")
            
        subgraph = GraphService.build_route_graph(metadata_path, route)
        return GraphSerializer.to_json(subgraph)
