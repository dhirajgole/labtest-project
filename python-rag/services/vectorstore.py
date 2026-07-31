from langchain_chroma import Chroma

from config import CHROMA_DB_PATH
from services.embeddings import get_embeddings


_vector_store = None


def get_vector_store():
    global _vector_store

    if _vector_store is None:
        _vector_store = Chroma(
            persist_directory=CHROMA_DB_PATH,
            embedding_function=get_embeddings()
        )

    return _vector_store