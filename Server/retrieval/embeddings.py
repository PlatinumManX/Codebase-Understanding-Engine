import json
from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:
    def __init__(
        self,
        chunks_path,
        model_name="BAAI/bge-base-en-v1.5"
    ):
        self.chunks_path = chunks_path
        self.model = SentenceTransformer(model_name)

    def load_chunks(self):
        """Load chunks.json"""
        with open(self.chunks_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def prepare_text(self, chunk):
        """Prepare text for embedding"""

        return (
            f"Type: {chunk['type']}\n"
            f"Name: {chunk['name']}\n\n"
            f"{chunk['code']}"
        )

    def generate_embeddings(self):
        chunks = self.load_chunks()
        embeddings = []

        for chunk in chunks:

            text = self.prepare_text(chunk)

            vector = self.model.encode(
                text,
                normalize_embeddings=True
            )

            embeddings.append(
                {
                    "id": chunk["id"],
                    "embedding": vector.tolist()
                }
            )

        return embeddings

    def save_embeddings(
        self,
        output_path="embeddings.json"
    ):
        embeddings = self.generate_embeddings()

        with open(
            output_path,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                embeddings,
                file,
                indent=4
            )

        print(
            f"Saved {len(embeddings)} embeddings "
            f"to {output_path}"
        )


from pathlib import Path

if __name__ == "__main__":

    base_dir = Path(__file__).resolve().parent.parent

    chunks_path = base_dir / "chunks.json"
    output_path = base_dir / "embeddings.json"

    generator = EmbeddingGenerator(chunks_path)

    generator.save_embeddings(output_path)