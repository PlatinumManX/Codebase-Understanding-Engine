from pyvis.network import Network
NODE_COLORS = {
    "module": "#4CAF50",             # Green
    "function": "#2196F3",           # Blue
    "class": "#9C27B0",              # Purple
    "method": "#FF9800",             # Orange
    "route": "#F44336",              # Red
    # "external_function": "#9E9E9E",  # Gray
    # "external_class": "#9E9E9E"
}
NODE_SIZES = {
    "module": 40,
    "function": 22,
    "class": 30,
    "method": 16,
    "route": 28,
}
NODE_SHAPES = {
    "module": "box",
    "function": "dot",
    "class": "diamond",
    "method": "ellipse",
    "route": "star",
}
class GraphVisualizer:
    def _get_color(self, node_type):
        return NODE_COLORS.get(node_type, "#607D8B")


    def _get_size(self, node_type):
        return NODE_SIZES.get(node_type, 20)


    def _get_shape(self, node_type):
        return NODE_SHAPES.get(node_type, "dot")
    def _get_label(self, node, data):

        node_type = data.get("type")

        if node_type == "module":
            return node.split("\\")[-1].split("/")[-1]

        elif node_type == "function":
            return f"{data['name']}()"

        elif node_type == "method":
            return f"{data['name']}()"

        elif node_type == "class":
            return data["name"]

        elif node_type == "route":
            return data["path"]

        return node
    def visualize(self, graph, output_file="graph.html"):
        if graph is None:
            print("Nothing to visualize.")
            return
        net = Network(
            height="850px",
            width="100%",
            directed=True,
        )
        net.barnes_hut(
            gravity=-20000,
            central_gravity=0.15,
            spring_length=180,
            spring_strength=0.03,
            damping=0.25)
        net.set_options("""
var options = {
  "physics": {
    "enabled": true,
    "barnesHut": {
      "gravitationalConstant": -2000,
      "centralGravity": 0.15,
      "springLength": 180,
      "springConstant": 0.03,
      "damping": 0.25
    }
  },
  "interaction": {
    "hover": true,
    "navigationButtons": true,
    "keyboard": true
  }
}
""")
        for node, data in graph.nodes(data=True):

            node_type = data.get("type", "unknown")

            net.add_node(
        node,
        label=self._get_label(node, data),
        title=str(data),
        color=self._get_color(node_type),
        size=self._get_size(node_type),
        shape=self._get_shape(node_type))

        for source, target, data in graph.edges(data=True):

            net.add_edge(
                source,
                target,
                label=data["type"]
            )

        net.show(output_file, notebook=False)