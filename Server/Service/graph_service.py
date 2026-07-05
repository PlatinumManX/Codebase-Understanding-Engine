from graph_engine.graph_builder import ModuleGraphBuilder
from graph_engine.graph_queries import (
    get_module_dependency_subgraph,
    get_function_call_subgraph,
    get_route_execution_subgraph,
)

class GraphService:

    @staticmethod
    def get_repository_graph(metadata_path):

        return ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

    @staticmethod
    def get_module_graph(metadata_path, module):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return get_module_dependency_subgraph(
            graph,
            module
        )

    @staticmethod
    def get_function_graph(metadata_path, function):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return get_function_call_subgraph(
            graph,
            function
        )

    @staticmethod
    def get_route_graph(metadata_path, route):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return get_route_execution_subgraph(
            graph,
            route
        )