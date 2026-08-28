from retrieval.retriever import Retriever
from llm.prompt_builder import PromptBuilder
from llm.llm_client import LLMClient


class ExplanationEngine:
    """
    Coordinates the AI query pipeline.

    Pipeline:

        User Question
              ↓
        Graph Context
              ↓
        Retrieval Query
              ↓
        Retriever
              ↓
        Prompt Builder
              ↓
        LLM Client
              ↓
        Explanation
    """

    def __init__(self, repository_id):
        self.retriever = Retriever.from_repository(
            repository_id
        )

        self.prompt_builder = PromptBuilder()
        self.llm_client = LLMClient()

    def generate_explanation(
        self,
        question,
        graph_context=None,
        conversation_history=None
    ):
        """
        Generate a natural language explanation.

        The LLM receives:

            - Current user question
            - Relevant code retrieved from RAG
            - Optional graph context
            - Optional conversation history
        """

        # ---------------------------------
        # Build retrieval query
        # ---------------------------------

        retrieval_query = self.build_retrieval_query(
            question=question,
            graph_context=graph_context,
            conversation_history=conversation_history
        )

        # ---------------------------------
        # Retrieve relevant code chunks
        # ---------------------------------

        retrieved_chunks = self.retriever.retrieve(
            retrieval_query
        )

        # ---------------------------------
        # Build LLM prompt
        # ---------------------------------

        prompt = self.prompt_builder.build_prompt(
            question=question,
            retrieved_chunks=retrieved_chunks,
            graph_context=graph_context,
            conversation_history=conversation_history
        )

        # ---------------------------------
        # Generate answer
        # ---------------------------------

        answer = self.llm_client.generate(
            prompt
        )

        return {
            "answer": answer,
            "retrieved_chunks": retrieved_chunks,
            "query_type": "LLM"
        }

    def build_retrieval_query(
        self,
        question,
        graph_context=None,
        conversation_history=None
    ):
        """
        Build a retrieval query using:

            - Conversation history
            - Current question
            - Selected graph element
            - Highlighted graph element

        Graph context is used as a retrieval hint.
        The actual graph is NOT sent to the retriever.
        """

        parts = []

        # ---------------------------------
        # Conversation context
        # ---------------------------------

        if conversation_history:

            for message in conversation_history:

                content = message.get(
                    "content",
                    ""
                )

                if content:
                    parts.append(content)

        # ---------------------------------
        # Current question
        # ---------------------------------

        parts.append(question)

        # ---------------------------------
        # Graph context
        # ---------------------------------

        if graph_context:

            selected = graph_context.get(
                "selected"
            )

            highlighted = graph_context.get(
                "highlighted"
            )

            if selected:

                parts.append(
                    self.format_graph_element(
                        selected,
                        "Selected graph element"
                    )
                )

            if highlighted:

                parts.append(
                    self.format_graph_element(
                        highlighted,
                        "Highlighted graph element"
                    )
                )

        return "\n".join(parts)

    def format_graph_element(
        self,
        element,
        label
    ):
        """
        Convert a graph element into a compact
        textual retrieval hint.
        """

        if not isinstance(element, dict):
            return f"{label}: {element}"

        parts = [label]

        element_id = element.get("id")
        element_type = element.get("type")
        name = element.get("name")
        file_name = element.get("file")

        if element_id:
            parts.append(
                f"ID: {element_id}"
            )

        if element_type:
            parts.append(
                f"Type: {element_type}"
            )

        if name:
            parts.append(
                f"Name: {name}"
            )

        if file_name:
            parts.append(
                f"File: {file_name}"
            )

        return "\n".join(parts)