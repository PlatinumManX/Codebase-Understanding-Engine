from repository_parser import (
    parse_repository
)
from dataclasses import asdict
import json

repo = parse_repository(
    "sample_repo"
)

# print(repo)

repo_dict = asdict(repo)

with open("metadata.json","w") as file:

    json.dump(repo_dict,file,indent=4)