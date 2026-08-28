import json
from pathlib import Path

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class Retriever:

    def __init__(
        self,
        chunks_path,
        index_path,
        mapping_path,
        model_name="BAAI/bge-base-en-v1.5"
    ):
        self.chunks = self.load_chunks(chunks_path)
        self.index = self.load_index(index_path)
        self.id_mapping = self.load_mapping(mapping_path)
        self.model = SentenceTransformer(model_name)

    @classmethod
    def from_repository(
        cls,
        repository_id,
        storage_root="storage/repositories"
    ):
        """
        Create a Retriever for a specific repository.
        """

        server_root = Path(__file__).resolve().parent.parent
        repository_path = server_root / storage_root / repository_id
        retrieval_path = repository_path / "retrieval"

        return cls(
            chunks_path=retrieval_path / "chunks.json",
            index_path=retrieval_path / "vector_index.faiss",
            mapping_path=retrieval_path / "id_mapping.json"
        )

    def load_chunks(self, chunks_path):
        """Load chunks.json"""

        with open(chunks_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def load_index(self, index_path):
        """Load FAISS index"""

        return faiss.read_index(str(index_path))

    def load_mapping(self, mapping_path):
        """Load ID mapping"""

        with open(mapping_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def embed_query(self, query):
        """Generate normalized embedding for the user query"""

        embedding = self.model.encode(
            query,
            normalize_embeddings=True
        )

        return np.array(
            [embedding],
            dtype=np.float32
        )

    def search(self, query_embedding, top_k):
        """Search the FAISS index"""

        scores, indices = self.index.search(
            query_embedding,
            top_k
        )

        return scores[0], indices[0]

    def retrieve(self, query, top_k=5):
        """Retrieve the most relevant code chunks"""

        query_embedding = self.embed_query(query)

        scores, indices = self.search(
            query_embedding,
            top_k
        )

        chunk_lookup = {
            chunk["id"]: chunk
            for chunk in self.chunks
        }

        results = []

        for score, index in zip(scores, indices):

            if index == -1:
                continue

            chunk_id = self.id_mapping.get(str(index))

            if chunk_id is None:
                continue

            chunk = chunk_lookup.get(chunk_id)

            if chunk is None:
                continue

            results.append(
                {
                    "chunk": chunk,
                    "score": float(score)
                }
            )

        return results


if __name__ == "__main__":

    repository_id = input("Enter repository ID: ")

    retriever = Retriever.from_repository(
        repository_id
    )

    query = input("Enter your query: ")

    results = retriever.retrieve(query)

    print("\nRetrieved Chunks:\n")

    for i, result in enumerate(results, start=1):

        print(f"Result {i}")
        print(f"Score : {result['score']:.4f}")
        print(f"ID    : {result['chunk']['id']}")
        print(f"Type  : {result['chunk']['type']}")
        print(f"Name  : {result['chunk']['name']}")
        print(f"File  : {result['chunk']['file']}")
        print("-" * 50)