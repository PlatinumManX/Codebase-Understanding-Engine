class GraphSerializer:

    @staticmethod
    def to_json(graph):
        nodes = []
        edges = []

        for node_id, data in graph.nodes(data=True):
            node_type = data.get("type")
            node_label = data.get("name", node_id)
            
            # Enrich data dictionary
            node_data = {}
            for k, v in data.items():
                if k not in ["type", "name"]:
                    node_data[k] = v
            if "name" in data:
                node_data["name"] = data["name"]
            if "path" in data:
                node_data["path"] = data["path"]
            if "file" in data:
                node_data["file"] = data["file"]

            nodes.append({
                "id": node_id,
                "type": node_type,
                "label": node_label,
                "data": node_data
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