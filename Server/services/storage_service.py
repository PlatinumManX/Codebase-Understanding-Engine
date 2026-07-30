import os
import shutil
import zipfile
import uuid
from pathlib import Path
from utils.ignore_dirs import IGNORE_DIRS

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
        workspace_path.mkdir(parents=True, exist_ok=True)
        
        (workspace_path / "source").mkdir(parents=True, exist_ok=True)
        (workspace_path / "parser").mkdir(parents=True, exist_ok=True)
        (workspace_path / "graph").mkdir(parents=True, exist_ok=True)
        (workspace_path / "retrieval").mkdir(parents=True, exist_ok=True)
        (workspace_path / "flow").mkdir(parents=True, exist_ok=True)
        (workspace_path / "cache").mkdir(parents=True, exist_ok=True)
        (workspace_path / "exports").mkdir(parents=True, exist_ok=True)
        (workspace_path / "logs").mkdir(parents=True, exist_ok=True)
        
        source_path = workspace_path / "source"
        return workspace_path, source_path

    def extract_zip(self, zip_path: Path, target_path: Path) -> Path:
        ignored_dirs = set()

        with zipfile.ZipFile(zip_path, "r") as zf:
            for member in zf.infolist():

            # Split the ZIP path into components
                parts = Path(member.filename).parts

                if any(
                    part.startswith(".") or part in IGNORE_DIRS
                    for part in parts[:-1]
                ):
                    continue

                zf.extract(member, target_path)

        if ignored_dirs:
            print(f"Ignored directories during extraction: {', '.join(sorted(ignored_dirs))}")

    # Determine actual root: handle single root folder inside ZIP
        items = [
        item
        for item in target_path.iterdir()
        if item.name != "__MACOSX" and not item.name.startswith(".")
        ]

        if len(items) == 1 and items[0].is_dir():
            return items[0]

        return target_path

    def cleanup_temp_dir(self, temp_path: Path):
        try:
            if temp_path.exists() and temp_path.is_dir():
                shutil.rmtree(temp_path)
        except Exception:
            pass
