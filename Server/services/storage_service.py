import os
import shutil
import zipfile
import uuid
from pathlib import Path

# Paths relative to Server root
BASE_DIR = Path(__file__).resolve().parent.parent
TEMP_DIR = BASE_DIR / "storage" / "temp"
REPOS_DIR = BASE_DIR / "storage" / "repositories"

class StorageService:
    def __init__(self):
        # Create storage structure on init
        TEMP_DIR.mkdir(parents=True, exist_ok=True)
        REPOS_DIR.mkdir(parents=True, exist_ok=True)

    def create_temp_upload_dir(self) -> Path:
        uid = uuid.uuid4().hex
        upload_path = TEMP_DIR / f"upload_{uid}"
        upload_path.mkdir(parents=True, exist_ok=True)
        return upload_path

    def create_repo_workspace(self, repo_id: str) -> tuple[Path, Path]:
        workspace_path = REPOS_DIR / repo_id
        source_path = workspace_path / "source"
        workspace_path.mkdir(parents=True, exist_ok=True)
        source_path.mkdir(parents=True, exist_ok=True)
        return workspace_path, source_path

    def extract_zip(self, zip_path: Path, target_path: Path) -> Path:
        # Extract files
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(target_path)
            
        # Determine actual root: handle single root folder inside ZIP
        items = [i for i in target_path.iterdir() if i.name != '__MACOSX' and not i.name.startswith('.')]
        if len(items) == 1 and items[0].is_dir():
            return items[0]
        return target_path

    def cleanup_temp_dir(self, temp_path: Path):
        try:
            if temp_path.exists() and temp_path.is_dir():
                shutil.rmtree(temp_path)
        except Exception:
            pass
