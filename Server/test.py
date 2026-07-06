from Service.graph_service import GraphService
import json
graph = GraphService.get_repository_graph(
    "Server\\metadata.json"
)
with open("graph.json", "w") as file:
    json.dump(graph, file, indent=4)