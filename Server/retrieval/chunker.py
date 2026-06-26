import json
import os


class CodeChunker:
    def __init__(self, metadata_path):
        self.metadata_path = metadata_path

    def load_metadata(self):
        """Load metadata.json"""
        with open(self.metadata_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def create_chunk(self, chunk_id, chunk_type, name, file_name, code):
        """Create a standardized chunk object"""
        return {
            "id": chunk_id,
            "type": chunk_type,
            "name": name,
            "file": file_name,
            "code": code
        }

    def generate_chunks(self):
        metadata = self.load_metadata()
        chunks = []

        for file_data in metadata.get("files", []):

            file_name = file_data["file_name"]
            file_prefix = os.path.splitext(file_name)[0]

            # Function lookup table for route chunks
            function_lookup = {
                function["name"]: function
                for function in file_data.get("functions", [])
            }

            # -----------------------------
            # Function Chunks
            # -----------------------------
            for function in file_data.get("functions", []):

                chunk_id = f"{file_prefix}_{function['name']}"

                chunks.append(
                    self.create_chunk(
                        chunk_id=chunk_id,
                        chunk_type="function",
                        name=function["name"],
                        file_name=file_name,
                        code=function.get("source_code", "")
                    )
                )

            # -----------------------------
            # Class Chunks
            # -----------------------------
            for cls in file_data.get("classes", []):

                chunk_id = f"{file_prefix}_{cls['name']}"

                chunks.append(
                    self.create_chunk(
                        chunk_id=chunk_id,
                        chunk_type="class",
                        name=cls["name"],
                        file_name=file_name,
                        code=cls.get("source_code", "")
                    )
                )

            # -----------------------------
            # Route Chunks
            # -----------------------------
            for route in file_data.get("routes", []):

                handler = route.get("handler", "")
                route_path = route.get("path", "")

                route_code = ""

                if handler in function_lookup:
                    route_code = function_lookup[handler].get(
                        "source_code",
                        ""
                    )

                chunk_id = (
                    f"{file_prefix}_route_"
                    f"{handler if handler else route_path.strip('/')}"
                )

                chunks.append(
                    self.create_chunk(
                        chunk_id=chunk_id,
                        chunk_type="route",
                        name=route_path,
                        file_name=file_name,
                        code=route_code
                    )
                )

        return chunks

    def save_chunks(self, output_path="chunks.json"):
        chunks = self.generate_chunks()

        with open(output_path, "w", encoding="utf-8") as file:
            json.dump(chunks, file, indent=4)

        print(f"Saved {len(chunks)} chunks to {output_path}")


if __name__ == "__main__":
    chunker = CodeChunker("metadata.json")
    chunker.save_chunks()