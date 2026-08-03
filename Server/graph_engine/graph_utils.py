def print_nodes(self):
        for node, data in self.graph.nodes(data=True):
            print(node, data)
def print_edges(self):
        for source, target, data in self.graph.edges(data=True):
            print(f"{source} ----[{data['type']}]----> {target}")