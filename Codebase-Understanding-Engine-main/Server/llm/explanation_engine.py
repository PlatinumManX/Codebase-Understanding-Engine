from retrieval.retriever import Retriever
from llm.prompt_builder import PromptBuilder
from llm.llm_client import LLMClient


class ExplanationEngine:
    """
    Coordinates the semantic query pipeline.

    Pipeline:
        User Question
              ↓
        Retriever
              ↓
        Prompt Builder
              ↓
        LLM Client
              ↓
        Explanation
    """

    def __init__(self):
        self.retriever = Retriever()
        self.prompt_builder = PromptBuilder()
        self.llm_client = LLMClient()

    def generate_explanation(self, question, flow=None):
        """
        Generate a natural language explanation for a semantic query.
        """

        # Retrieve relevant code chunks
        retrieved_chunks = self.retriever.retrieve(question)

        # Build the LLM prompt
        prompt = self.prompt_builder.build_prompt(
            question=question,
            retrieved_chunks=retrieved_chunks,
            flow=flow
        )

        # Generate explanation
        answer = self.llm_client.generate(prompt)

        return {
            "answer": answer,
            "retrieved_chunks": retrieved_chunks,
            "query_type": "semantic"
        }


if __name__ == "__main__":

    engine = ExplanationEngine()

    while True:

        question = input("\nEnter a semantic query (or 'exit'): ")

        if question.lower() == "exit":
            break

        result = engine.generate_explanation(question)

        print("\nGenerated Explanation:\n")
        print(result["answer"])