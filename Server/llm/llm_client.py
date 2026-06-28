import os
import time

from dotenv import load_dotenv
from google import genai


class LLMClient:

    _current_index = 0

    MODEL_NAME = "gemini-2.5-flash"

    def __init__(self):

        from pathlib import Path

        load_dotenv(Path(__file__).resolve().parent.parent / ".env")

        keys = os.getenv("GEMINI_API_KEYS", "")

        self.keys_pool = [
            key.strip()
            for key in keys.split(",")
            if key.strip()
        ]

        if not self.keys_pool:
            raise ValueError(
                "No Gemini API keys found. "
                "Please configure GEMINI_API_KEYS in the .env file."
            )

    def _create_client(self, api_key):
        """Create a Gemini client using the given API key."""
        return genai.Client(api_key=api_key)

    def _is_quota_error(self, error):
        """Determine whether an error is caused by quota exhaustion."""

        message = str(error).lower()

        return (
            "429" in message
            or "quota" in message
            or "limit" in message
            or "exhausted" in message
        )

    def _run_with_rotation(self, task_callback):
        """
        Execute a Gemini request using automatic API key rotation.
        """

        attempts = len(self.keys_pool)

        for _ in range(attempts):

            api_key = self.keys_pool[self._current_index]

            client = self._create_client(api_key)

            try:
                return task_callback(client)

            except Exception as error:

                if (
                    self._is_quota_error(error)
                    and len(self.keys_pool) > 1
                ):

                    print(
                        f"API key at index "
                        f"{self._current_index} exhausted. Rotating..."
                    )

                    self.__class__._current_index = (
                        self._current_index + 1
                    ) % len(self.keys_pool)

                    time.sleep(0.5)

                    continue

                raise error

        raise RuntimeError(
            "All available API keys have exhausted their quota."
        )

    def generate(self, prompt):
        """
        Generate a response from Gemini.
        """

        def task(client):

            response = client.models.generate_content(
                model=self.MODEL_NAME,
                contents=prompt
            )

            return response.text

        return self._run_with_rotation(task)
    
if __name__ == "__main__":

    client = LLMClient()

    prompt = input("Enter a prompt: ")

    try:

        response = client.generate(prompt)

        print("\nGemini Response:\n")
        print(response)

    except Exception as error:

        print("\nError:")
        print(error)