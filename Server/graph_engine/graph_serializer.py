class GraphSerializer:

    @staticmethod
    def to_json(graph):

        nodes = []
        edges = []

        for node_id, data in graph.nodes(data=True):

            nodes.append({
                "id": node_id,
                "type": data.get("type"),
                "label": data.get("name", node_id),
                "data": data
            })

        for source, target, data in graph.edges(data=True):

            edges.append({
                "id": f"{source}->{target}",
                "source": source,
                "target": target,
                "type": data.get("type"),
                "data": data
            })

        return {
            "nodes": nodes,
            "edges": edges
        }