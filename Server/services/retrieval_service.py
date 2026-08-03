from pathlib import Path

from retrieval.chunker import CodeChunker
from retrieval.embeddings import EmbeddingGenerator
from retrieval.vectordb import VectorDatabase

class RetrievalService:

    def build_repository_index(self, workspace_path: Path):
        
        retrieval_dir = workspace_path / "retrieval"
        parser_dir = workspace_path / "parser"

        metadata_path = parser_dir / "metadata.json"

        chunks_path = retrieval_dir / "chunks.json"
        embeddings_path = retrieval_dir / "embeddings.json"

        index_path = retrieval_dir / "vector_index.faiss"
        mapping_path = retrieval_dir / "id_mapping.json"
        
        #Step 1 - Generate Chunks
        chunker = CodeChunker(metadata_path)
        chunker.save_chunks(chunks_path)

        #Step 2 - Generate Embeddings
        generator = EmbeddingGenerator(chunks_path)
        generator.save_embeddings(embeddings_path)

        #Step 3 - Build FAISS Index
        vectordb = VectorDatabase(embeddings_path)
        vectordb.build_index()
        vectordb.save_index(index_path)
        vectordb.save_mapping(mapping_path)

        return {
            "chunks" : chunks_path,
            "embeddings" : embeddings_path,
            "faiss" : index_path,
            "mapping" : mapping_path#,
            #"chunk_count" : len(chunks),
            #"embedding_count" : len(embeddings)
        }
    