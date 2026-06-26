import ast
import os
from platform import node

from Parser.models import (
    FileMetadata,
    FunctionInfo,
    ClassInfo,
    RouteInfo
)
API_LIBRARIES = {
    "requests",
    "httpx",
    "aiohttp"
}
class MetadataVisitor(ast.NodeVisitor):

    def __init__(self):

        self.imports = []

        self.module_calls = []

        self.functions = []

        self.classes = []

        self.routes = []

        # self.dependencies = []

        self.current_function = None

        self.current_class = None
    def visit_Import(self, node):

        for alias in node.names:

            self.imports.append(alias.name)
    def visit_ImportFrom(self, node):

        if node.module:

            self.imports.append(node.module)
    def process_function(self,node,is_async=False):

        if self.current_class is None:
            parameters = []
            for arg in node.args.args:
                parameters.append(arg.arg)
            function = FunctionInfo(
                name=node.name,
                parameters=parameters,
                source_code=ast.unparse(node),
                is_async=is_async
            )

        # Route extraction
            for decorator in node.decorator_list:

                if(isinstance(decorator, ast.Call) and isinstance(decorator.func,ast.Attribute) and decorator.func.attr == "route"):

                    route_path = None
                    methods = []

                    if (decorator.args
                        and isinstance(
                            decorator.args[0],
                            ast.Constant
                        )
                    ):
                        route_path = (
                            decorator.args[0].value
                        )

                    for keyword in decorator.keywords:

                        if (
                            keyword.arg
                            == "methods"
                        ):

                            if isinstance(
                                keyword.value,
                                ast.List
                            ):

                                for item in keyword.value.elts:

                                   if isinstance(
                                        item,
                                        ast.Constant
                                    ):

                                        methods.append(
                                            item.value
                                        )

                    if route_path:

                        self.routes.append(
                            RouteInfo(
                                path=route_path,
                                handler=node.name,
                                methods=methods
                            )
                        )

            self.functions.append(function)

            self.current_function = function

        # IMPORTANT:
        # don't generic_visit(node)
        # because that visits decorators

            for stmt in node.body:
                self.visit(stmt)

            self.current_function = None

        else:

            for stmt in node.body:
                self.visit(stmt)
    def visit_FunctionDef(self,node):
        self.process_function(
        node,
        is_async=False
    )
    def visit_AsyncFunctionDef(self,node):
        self.process_function(
        node,
        is_async=True
    )
    def visit_Call(self, node):

        if isinstance(node.func,ast.Name):

            if self.current_function:

                self.current_function.calls.append(node.func.id)

            else:

                self.module_calls.append(node.func.id)
        elif isinstance(node.func,ast.Attribute):
            object_name = None

            if isinstance(node.func.value,ast.Name):

                object_name = (node.func.value.id)

            call_name = (f"{object_name}.{node.func.attr}")
            # DB_KEYWORDS = {
            #     "query",
            #     "filter",
            #     "filter_by",
            #     "execute",
            #     "commit",
            #     "rollback",
            #     "add",
            #     "delete",
            #     "save"
            # }
            # if node.func.attr in DB_KEYWORDS:

            #     self.current_function.database_operations.append(call_name)
            if self.current_function:

                self.current_function.calls.append(call_name)
                if object_name in API_LIBRARIES:

                    self.current_function.external_api_calls.append(call_name)
            else:
                self.module_calls.append(call_name)
        self.generic_visit(node)

    def visit_ClassDef(self, node):
        inherits = []

        for base in node.bases:

            if isinstance(base, ast.Name):

                inherits.append(base.id)
        class_info = ClassInfo(name=node.name, inherits=inherits)

        self.current_class = class_info
        for child in node.body:

            if isinstance(child,ast.FunctionDef):

                class_info.methods.append(child.name)

        self.classes.append(class_info)

        self.generic_visit(node)
        self.current_class = None

def parse_file(path, repo_path):

    with open(path,"r",encoding="utf-8") as file:

        code = file.read()

    tree = ast.parse(code)

    visitor = MetadataVisitor()

    visitor.visit(tree)
    relative_path=os.path.relpath(path,repo_path)
    metadata = FileMetadata(

        file_name=os.path.basename(path),
        file_path=relative_path,

        imports=visitor.imports,

        dependencies=[],

        module_calls=visitor.module_calls,

        functions=visitor.functions,

        classes=visitor.classes,

        routes=visitor.routes
    )
    

    return metadata