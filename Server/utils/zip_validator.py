import os
import zipfile
from pathlib import Path

MAX_ZIP_SIZE = 500 * 1024 * 1024  # 500 MB

def is_valid_zip_extension(filename: str) -> bool:
    return filename.lower().endswith('.zip')

def validate_zip_file(file_path: Path) -> tuple[bool, str]:
    # 1. Check size
    if not file_path.exists():
        return False, "File does not exist"
    
    file_size = file_path.stat().st_size
    if file_size == 0:
        return False, "File is empty"
    if file_size > MAX_ZIP_SIZE:
        return False, "File exceeds maximum allowed size (500 MB)"

    # 2. Check if valid zip format
    if not zipfile.is_zipfile(file_path):
        return False, "File is not a valid ZIP archive or is corrupted"

    # 3. Prevent Path Traversal (Zip Slip)
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            infolist = zf.infolist()
            if not infolist:
                return False, "ZIP archive contains no files"
                
            for info in infolist:
                name = info.filename
                # Detect traversal paths like ..
                if '..' in name or name.startswith('/') or name.startswith('\\'):
                    return False, "Security warning: Malicious path traversal detected inside ZIP"
                
                # Check target name resolution safety
                try:
                    Path('/safe/root').joinpath(name).relative_to('/safe/root')
                except ValueError:
                    return False, "Security warning: Dangerous paths escaping target workspace detected"
    except zipfile.BadZipFile:
        return False, "Corrupted ZIP archive"
    except Exception as e:
        return False, f"ZIP validation error: {str(e)}"

    return True, "Valid ZIP archive"
