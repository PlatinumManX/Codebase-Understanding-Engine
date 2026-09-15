from pathlib import Path

from llm.query_classifier import QueryClassifier
from llm.explanation_engine import ExplanationEngine

from services.chat_context_service import ChatContextService
from services.repository_service import RepositoryService
from services.graph_service import GraphService

from graph_engine.graph_queries import (
    search_functions,
    get_function_call_subgraph
)

class QueryOrchestrator:
    """
    Coordinates the AI query pipeline.

    Execution types:

        LLM
            Query is answered using RAG + LLM.

        GRAPH_LLM
            Query is answered using RAG + LLM with
            optional graph context.
    """

    def __init__(self, repository_id):

        self.repository_id = repository_id

        self.classifier = QueryClassifier()

        self.explanation_engine = ExplanationEngine(
            repository_id
        )

        self.chat_context_service = ChatContextService()

        self.repository_service = RepositoryService()

        self.graph_service = GraphService()

    def load_graph(self):
        repository = self.repository_service.get_repository_by_id(self.repository_id)

        storage_paths = repository.get("storage_paths", {})
        metadata_path = storage_paths.get("metadata")

        if not metadata_path:
            raise ValueError(
                "Metadata path not found for Repository"
            )

        metadata_path = Path(metadata_path)

        if not metadata_path.is_absolute():
            metadata_path = (
                Path(__file__).resolve().parent.parent
                / metadata_path
            )

        return self.graph_service.build_repository_graph(
            metadata_path
        )

    def resolve_function(self, graph, query):
        """
        Try to identify a function mentioned in the query.

        Returns the first matching function ID.
        """

        words = (
            query
            .replace("(", " ")
            .replace(")", " ")
            .split()
        )

        for word in words:
            if not word.isidentifier():
                continue

            matches = search_functions(
                graph,
                word
            )

            if matches:
                return matches[0]

        return None

    def build_graph_context(
            self,
            graph,
            query,
            intent,
            selected=None
    ):
        """
        Generate graph context for a Graph_LLM query.
        """

        #----------------------------------
        # Explicitly selected graph element
        #----------------------------------
        if selected:
            selected_type = selected.get("type")
            selected_id = selected.get("id")

            if selected_type == "function":
                subgraph = get_function_call_subgraph(
                    graph,
                    selected_id
                )

                return {
                    "operation": "function_flow",
                    "target": selected_id,
                    "subgraph": subgraph
                }

        #----------------------------------
        # Automatic function resolution
        #----------------------------------
        if intent == "flow":
            function_id = self.resolve_function(
                graph,
                query
            )

            if not function_id:
                return {
                    "operation": "function_flow",
                    "target": None,
                    "node_ids": [],
                    "edge_ids": [],
                    "error": "Could not identify a function from the query."
                }

            subgraph = get_function_call_subgraph(
                graph,
                function_id
            )

            return {
                "operation": "function_flow",
                "target": function_id,
                "subgraph": subgraph
            }

    def serialize_graph_context(self, graph_context):
        """
        Convert graph context into a JSON-serializable graph context.
        """

        if not graph_context:
            return None

        subgraph = graph_context.get("subgraph")

        if subgraph is None:
            return graph_context

        nodes = [
            {
                "id": node_id,
                **data
            }
            for node_id, data in subgraph.nodes(data=True)
        ]

        edges = [
            {
                "id": f"{source}->{target}",
                "source": source,
                "target": target,
                **data
            }
            for source, target, data in subgraph.edges(data=True)
        ]

        return {
            "operation": graph_context.get("operation"),
            "target": graph_context.get("target"),
            "nodes": nodes,
            "edges": edges,
            "node_ids": [node["id"] for node in nodes],
            "edge_ids": [edge["id"] for edge in edges]
        }

    def process_query(
        self,
        query,
        selected=None,
        highlighted=None,
        conversation_id=None
    ):
        """
        Process a user query within a conversation.

        Flow:

            Query
            ↓
            Classify
            ↓
            Load conversation history
            ↓
            Prepare graph context
            ↓
            Generate answer
            ↓
            Store user message
            ↓
            Store assistant response
        """

        # ---------------------------------
        # Classify query
        # ---------------------------------

        classification = self.classifier.classify(
            query
        )

        query_type = classification["type"]
        intent = classification["intent"]

        # ---------------------------------
        # Create conversation if necessary
        # ---------------------------------

        if conversation_id is None:

            conversation_id = (
                self.chat_context_service
                .create_conversation(
                    self.repository_id
                )
            )

        # ---------------------------------
        # Load previous conversation history
        # ---------------------------------

        conversation_history = (
            self.chat_context_service
            .get_messages(
                conversation_id,
                self.repository_id
            )
        )

        # ---------------------------------
        # Prepare graph context
        # ---------------------------------

        graph_context = None

        if query_type == "GRAPH_LLM":
            graph = self.load_graph()

            graph_context = self.build_graph_context(
                graph=graph,
                query=query,
                intent=intent,
                selected=selected
            )

            graph_context = self.serialize_graph_context(
                graph_context
            )

        elif selected or highlighted:
            graph_context = {
                "selected": selected,
                "highlighted": highlighted
            }

        # ---------------------------------
        # Generate answer
        # ---------------------------------

        result = (
            self.explanation_engine
            .generate_explanation(
                question=query,
                graph_context=graph_context,
                conversation_history=conversation_history
            )
        )

        answer = result["answer"]

        # ---------------------------------
        # Store user message
        # ---------------------------------

        self.chat_context_service.add_message(
            conversation_id=conversation_id,
            repository_id=self.repository_id,
            role="user",
            content=query
        )

        # ---------------------------------
        # Store assistant response
        # ---------------------------------

        self.chat_context_service.add_message(
            conversation_id=conversation_id,
            repository_id=self.repository_id,
            role="assistant",
            content=answer
        )

        # ---------------------------------
        # Return result
        # ---------------------------------

        graph_action = None

        if graph_context and graph_context.get("operation"):
            graph_action = {
                "operation": graph_context["operation"],
                "target": graph_context["target"],
                "node_ids": graph_context.get("node_ids", []),
                "edge_ids": graph_context.get("edge_ids", [])
            }

        return {
            "query": query,
            "query_type": query_type,
            "intent": intent,
            "answer": answer,
            "retrieved_chunks": result.get(
                "retrieved_chunks",
                []
            ),
            "graph_context": graph_context,
            "graph_action": graph_action,
            "conversation_id": conversation_id
        }
