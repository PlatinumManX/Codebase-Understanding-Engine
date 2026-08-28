from llm.query_classifier import QueryClassifier
from llm.explanation_engine import ExplanationEngine
from services.chat_context_service import ChatContextService


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

        if selected or highlighted:

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
            "conversation_id": conversation_id
        }
