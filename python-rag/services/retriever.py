from services.vectorstore import get_vector_store


def retrieve_documents(query: str):

    retriever = get_vector_store().as_retriever(
        search_kwargs={"k": 5}
    )

    return retriever.invoke(query)