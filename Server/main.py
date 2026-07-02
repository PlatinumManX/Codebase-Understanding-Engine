from Parser.repository_parser import (
    parse_repository
)

from pathlib import Path
from dataclasses import asdict
import json

# 1. Get the directory where main.py actually lives
SCRIPT_DIR = Path(__file__).resolve().parent

# 2. Force the file to save exactly in that folder
output_path = SCRIPT_DIR / "metadata.json"

repo = parse_repository(
    "Sample_repo"
)

# print(repo)

repo_dict = asdict(repo)

with open(output_path,"w") as file:

    json.dump(repo_dict,file,indent=4)