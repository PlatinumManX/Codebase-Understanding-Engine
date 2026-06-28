class PromptBuilder:

    SYSTEM_PROMPT = (
        "You are an expert software architect.\n"
        "Answer the user's question using ONLY the provided code and flow information.\n"
        "Do not invent implementation details.\n"
        "If the provided context is insufficient, clearly state that more code or "
        "project information is required."
    )

    def build_prompt(self, question, retrieved_chunks, flow=None):
        """
        Build a structured prompt for the LLM.
        """

        prompt = self.SYSTEM_PROMPT

        prompt += "\n\n"
        prompt += "QUESTION:\n"
        prompt += f"{question}\n"

        if flow:
            prompt += "\nFLOW:\n"
            prompt += f"{flow}\n"

        prompt += "\nRELEVANT CODE:\n"

        for result in retrieved_chunks:

            chunk = result["chunk"]

            prompt += "\n------------------------------\n"
            prompt += f"ID: {chunk['id']}\n"
            prompt += f"TYPE: {chunk['type']}\n"
            prompt += f"NAME: {chunk['name']}\n"
            prompt += f"FILE: {chunk['file']}\n\n"

            prompt += "CODE:\n"
            prompt += f"{chunk['code']}\n"

        prompt += (
            "\nINSTRUCTIONS:\n"
            "- Explain the requested functionality clearly.\n"
            "- Use only the supplied context.\n"
            "- Mention interactions between modules when evident.\n"
            "- If information is missing, say so instead of guessing.\n"
        )

        return prompt


if __name__ == "__main__":

    sample_chunks = [
        {
            "chunk": {
                "id": "auth_login",
                "type": "function",
                "name": "login",
                "file": "auth.py",
                "code": (
                    "def login(username, password):\n"
                    "    authenticate(username, password)"
                )
            },
            "score": 0.94
        }
    ]

    builder = PromptBuilder()

    prompt = builder.build_prompt(
        question="Explain the login workflow.",
        retrieved_chunks=sample_chunks,
        flow="/login -> login() -> authenticate()"
    )

    print(prompt)