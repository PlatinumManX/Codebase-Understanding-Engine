from collections import Counter


class GraphStatistics:

    @staticmethod
    def print_statistics(repository, graph):

        print("=" * 50)
        print("Repository Statistics")
        print("=" * 50)

        print(f"Repository : {repository.repository_name}")
        print(f"Files      : {len(repository.files)}")
        print(f"Nodes      : {graph.number_of_nodes()}")
        print(f"Edges      : {graph.number_of_edges()}")

        print()

        node_counter = Counter()

        for _, data in graph.nodes(data=True):
            node_counter[data.get("type", "unknown")] += 1

        print("Node Types")
        print("-" * 30)

        for node_type, count in sorted(node_counter.items()):
            print(f"{node_type:<12} : {count}")

        print()

        edge_counter = Counter()

        for _, _, data in graph.edges(data=True):
            edge_counter[data.get("type", "unknown")] += 1

        print("Edge Types")
        print("-" * 30)

        for edge_type, count in sorted(edge_counter.items()):
            print(f"{edge_type:<12} : {count}")