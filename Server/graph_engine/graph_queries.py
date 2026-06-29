# Basic Node Queries
from collections import deque
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
def find_module(graph, module_name):

    if graph.has_node(module_name):
        return graph.nodes[module_name]

    return None
def find_function(graph, function_id):

    if graph.has_node(function_id):
        return graph.nodes[function_id]

    return None
def find_route(graph, route):

    node = f"ROUTE:{route}"

    if graph.has_node(node):
        return graph.nodes[node]

    return None

# Relationship Queries of specific nodes
def get_dependencies(graph, module):

    dependencies = []

    for neighbor in graph.successors(module):

        edge = graph.get_edge_data(
            module,
            neighbor
        )

        if edge["type"] == "imports":

            dependencies.append(neighbor)
    return dependencies
def get_functions(graph, module):

    functions = []

    for neighbor in graph.successors(module):

        edge = graph.get_edge_data(
            module,
            neighbor
        )
        if edge["type"] == "contains":

            if graph.nodes[neighbor]["type"] == "function":

                functions.append(neighbor)
    return functions
def get_called_functions(graph, function):

    calls = []

    for neighbor in graph.successors(function):

        edge = graph.get_edge_data(
            function,
            neighbor
        )

        if edge["type"] == "calls":

            calls.append(neighbor)

    return calls
def get_routes(graph, module):
    routes=[]
    for neighbor in graph.successors(module):
        edge= graph.get_edge_data(module,neighbor)
        if edge["type"]=="defines_route":
            if graph.nodes[neighbor]["type"]=="route":
                routes.append(neighbor)
    return routes
def get_classes(graph,module):
    classes=[]
    for neighbor in graph.successors(module):
        edge= graph.get_edge_data(module,neighbor)
        if edge["type"]=="contains":
            if graph.nodes[neighbor]["type"]=="class":
                classes.append(neighbor)
    return classes

def find_shortest_path(graph, source, target):
    try:
        return nx.shortest_path(
            graph,
            source,
            target
        )
    except nx.NetworkXNoPath:
        return []
    except nx.NodeNotFound:
        return []

def get_reachable_functions(graph, function_id):

    reachable = []

    descendants = nx.descendants(
        graph,
        function_id
    )

    for node in descendants:

        if (
            graph.nodes[node]["type"]
            == "function"
        ):

            reachable.append(node)

    return reachable

def get_callers(graph, function_id):

    callers = []

    for predecessor in graph.predecessors(function_id):

        edge = graph.get_edge_data(
            predecessor,
            function_id
        )

        if edge["type"] == "calls":

            callers.append(predecessor)

    return callers
# Search Queries
def search_nodes_by_name(graph, name):

    results = []

    for node, data in graph.nodes(data=True):

        if data.get("name") == name:

            results.append(node)

    return results
def search_functions(graph, function_name):

    results = []

    for node, data in graph.nodes(data=True):

        if (
            data["type"] == "function"
            and data["name"] == function_name
        ):

            results.append(node)

    return results
def search_modules(graph, module_name):

    results = []

    for node, data in graph.nodes(data=True):

        if (
            data["type"] == "module"
            and module_name.lower() in node.lower()
        ):

            results.append(node)

    return results
# 3 Subgraph Queries
def get_module_dependency_subgraph(graph, module):

    if not graph.has_node(module):
        return None

    visited = {module}

    for neighbor in graph.successors(module):

        edge = graph.get_edge_data(module, neighbor)

        if edge["type"] == EDGE_IMPORTS:

            visited.add(neighbor)

    return graph.subgraph(visited).copy()

def get_function_call_subgraph(graph, function_id):

    if not graph.has_node(function_id):
        return None

    visited = set()

    queue = deque([function_id])

    while queue:

        current = queue.popleft()

        if current in visited:
            continue

        visited.add(current)

        for neighbor in graph.successors(current):

            edge = graph.get_edge_data(current, neighbor)

            if edge["type"] == EDGE_CALLS:

                queue.append(neighbor)

    return graph.subgraph(visited).copy()

def get_route_execution_subgraph(graph, route_path):

    route_id = f"ROUTE:{route_path}"

    if not graph.has_node(route_id):
        return None

    visited = set()

    queue = deque([route_id])

    while queue:

        current = queue.popleft()

        if current in visited:
            continue

        visited.add(current)

        for neighbor in graph.successors(current):

            edge = graph.get_edge_data(current, neighbor)

            if edge["type"] in (EDGE_HANDLED_BY, EDGE_CALLS):

                queue.append(neighbor)

    return graph.subgraph(visited).copy()