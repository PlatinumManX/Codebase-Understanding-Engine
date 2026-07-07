import json
from pathlib import Path
from graph_engine.graph_builder import ModuleGraphBuilder
from graph_engine.graph_queries import (
    get_module_dependency_subgraph,
    get_function_call_subgraph,
    get_route_execution_subgraph,
)
from graph_engine.graph_serializer import GraphSerializer

class GraphService:

    @staticmethod
    def build_repository_graph(metadata_path):
        return ModuleGraphBuilder.from_metadata_json(metadata_path)

    @staticmethod
    def build_module_graph(metadata_path, module):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return get_module_dependency_subgraph(graph, module)

    @staticmethod
    def build_function_graph(metadata_path, function):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return get_function_call_subgraph(graph, function)

    @staticmethod
    def build_route_graph(metadata_path, route):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return get_route_execution_subgraph(graph, route)

    @staticmethod
    def save_graph(graph_data, target_path: Path):
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(graph_data, f, indent=2, ensure_ascii=False)

    @staticmethod
    def load_graph(target_path: Path) -> dict:
        with open(target_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    # Maintain legacy support for backward compatibility in case they are used elsewhere
    @staticmethod
    def get_repository_graph(metadata_path):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return GraphSerializer.to_json(graph)

    @staticmethod
    def get_module_graph(metadata_path, module):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return GraphSerializer.to_json(get_module_dependency_subgraph(graph, module))

    @staticmethod
    def get_function_graph(metadata_path, function):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return GraphSerializer.to_json(get_function_call_subgraph(graph, function))

    @staticmethod
    def get_route_graph(metadata_path, route):
        graph = ModuleGraphBuilder.from_metadata_json(metadata_path)
        return GraphSerializer.to_json(get_route_execution_subgraph(graph, route))