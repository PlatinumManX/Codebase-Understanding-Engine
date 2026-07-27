import json
from dataclasses import asdict
from Parser.repository_parser import parse_repository
repo = parse_repository(r"C:\Users\Tanu Bhardwaj\Downloads\CodeMap_Parser_Playground\test_repositories\Resume analyzer")

repo_dict = asdict(repo)

with open("metadata1.json","w") as file:

    json.dump(repo_dict,file,indent=4)