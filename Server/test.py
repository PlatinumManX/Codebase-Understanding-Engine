from Service.graph_service import GraphService

graph = GraphService.get_repository_graph(
    "C:\\Users\\Tanu Bhardwaj\\Downloads\\Codebase-Understanding-Engine\\Server\\storage\\repositories\\repo_51be89a1789b41fea4ab506edb545edf\\metadata.json"
)

print(graph.number_of_nodes())
print(graph.number_of_edges())
# from graph_engine.Service.graph_service import GraphService

graph = GraphService.get_repository_graph(
    "C:\\Users\\Tanu Bhardwaj\\Downloads\\Codebase-Understanding-Engine\\Server\\storage\\repositories\\repo_51be89a1789b41fea4ab506edb545edf\\metadata.json"
)

print(graph.number_of_nodes())
print(graph.number_of_edges())
# module_graph = GraphService.get_module_graph(
#     "metadata.json",
#     "auth.py"
# )

# print(module_graph.number_of_nodes())
# function_graph = GraphService.get_function_graph(
#     "metadata.json",
#     "auth.py::login"
# )

# print(function_graph.number_of_nodes())
# route_graph = GraphService.get_route_graph(
#     "metadata.json",
#     "/login"
# )

# print(route_graph.number_of_nodes())