import networkx as nx

NODE_MODULE = "module"
NODE_FUNCTION = "function"
NODE_ROUTE = "route"
NODE_CLASS = "class"
NODE_METHOD = "method"
# EDGE TYPES
EDGE_IMPORTS = "imports"
EDGE_CONTAINS = "contains"
EDGE_CALLS = "calls"
EDGE_HANDLED_BY = "handled_by"
EDGE_DEFINES_ROUTE = "defines_route"
EDGE_HAS_METHOD = "has_method"
EDGE_INHERITS = "inherits"
class ModuleGraphBuilder:

    def __init__(self):
        self.graph = nx.DiGraph()
    def build(self, repository):
        self._add_modules(repository)

        self._add_imports(repository)

        self._add_functions(repository)

        self._add_calls(repository)

        self._add_routes(repository)

        self._add_classes(repository)
    def _add_modules(self, repository):
        for file in repository.files:
            self.graph.add_node(file.file_path, type=NODE_MODULE, name=file.file_name)
    def _add_imports(self, repository):
        for file in repository.files:
            for dependency in file.dependencies:
                self.graph.add_edge(file.file_path,dependency,type=EDGE_IMPORTS)
    def _add_functions(self, repository):
        for file in repository.files:
            for function in file.functions:
                function_id = (f"{file.file_path}::{function.name}")
                self.graph.add_node(function_id,type=NODE_FUNCTION, name=function.name)
                self.graph.add_edge(file.file_path,function_id,type=EDGE_CONTAINS)
    def _add_calls(self, repository):
        for file in repository.files:
            for function in file.functions:
                source_id = f"{file.file_path}::{function.name}"
                for call in function.resolved_calls:
                    target_id = f"{call.file}::{call.function}"
                    self.graph.add_edge(source_id,target_id,type=EDGE_CALLS)
    def _add_routes(self, repository):
        for file in repository.files:

            for route in file.routes:
                route_id = f"ROUTE:{route.path}"
                self.graph.add_node(route_id,type=NODE_ROUTE, path=route.path, methods=route.methods)
                self.graph.add_edge(file.file_path,route_id,type=EDGE_DEFINES_ROUTE)
                handler_id = f"{file.file_path}::{route.handler}"
                self.graph.add_edge(route_id,handler_id,type=EDGE_HANDLED_BY)
    def _add_classes(self, repository):
        for file in repository.files:

            for cls in file.classes:
                class_id = f"{file.file_path}::{cls.name}"
                self.graph.add_node(class_id,type=NODE_CLASS, name=cls.name)
                self.graph.add_edge(file.file_path,class_id,type=EDGE_CONTAINS)
                for method in cls.methods:
                    method_id = (f"{class_id}::{method}")
                    self.graph.add_node(method_id,type=NODE_METHOD, name=method)
                    self.graph.add_edge(class_id,method_id,type=EDGE_HAS_METHOD)
                for parent in cls.inherits:

                    parent_id = (f"{file.file_path}::{parent}")
                    if not self.graph.has_node(parent_id):
                        self.graph.add_node(parent_id,type="external_class",name=parent)
                    self.graph.add_edge(class_id,parent_id,type=EDGE_INHERITS)

