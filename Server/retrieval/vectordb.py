import json
import numpy as np
import faiss


class VectorDatabase:
    def __init__(self, embeddings_path):
        self.embeddings_path = embeddings_path
        self.index = None
        self.id_mapping = {}

    def load_embeddings(self):
        """Load embeddings.json"""
        with open(self.embeddings_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def build_index(self):
        embeddings_data = self.load_embeddings()

        vectors = []

        for idx, item in enumerate(embeddings_data):

            vectors.append(item["embedding"])

            self.id_mapping[str(idx)] = item["id"]

        vectors = np.array(vectors, dtype=np.float32)

        dimension = vectors.shape[1]

        self.index = faiss.IndexFlatIP(dimension)

        self.index.add(vectors)

        print(f"Indexed {self.index.ntotal} vectors.")

    def save_index(self, index_path="vector_index.faiss"):
        faiss.write_index(self.index, index_path)

        print(f"Saved FAISS index to {index_path}")

    def save_mapping(self, mapping_path="id_mapping.json"):
        with open(mapping_path, "w", encoding="utf-8") as file:
            json.dump(
                self.id_mapping,
                file,
                indent=4
            )

        print(f"Saved ID mapping to {mapping_path}")


if __name__ == "__main__":

    vectordb = VectorDatabase(
        "embeddings.json"
    )

    vectordb.build_index()

    vectordb.save_index()

    vectordb.save_mapping()