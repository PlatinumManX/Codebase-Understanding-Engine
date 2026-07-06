from graph_engine.graph_builder import ModuleGraphBuilder
from graph_engine.graph_queries import (
    get_module_dependency_subgraph,
    get_function_call_subgraph,
    get_route_execution_subgraph,
)
from graph_engine.graph_serializer import GraphSerializer

class GraphService:

    @staticmethod
    def get_repository_graph(metadata_path):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )
        return GraphSerializer.to_json(graph)
    @staticmethod
    def get_module_graph(metadata_path, module):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return GraphSerializer.to_json(get_module_dependency_subgraph(
            graph,
            module
        ))

    @staticmethod
    def get_function_graph(metadata_path, function):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return GraphSerializer.to_json(get_function_call_subgraph(
            graph,
            function
        ))

    @staticmethod
    def get_route_graph(metadata_path, route):

        graph = ModuleGraphBuilder.from_metadata_json(
            metadata_path
        )

        return GraphSerializer.to_json(get_route_execution_subgraph(
            graph,
            route
        ))