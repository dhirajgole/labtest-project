from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage
)


def build_messages(
    system_prompt,
    conversation_history,
    db_context,
    rag_context,
    question
):

    messages = []

    # System Prompt
    messages.append(
        SystemMessage(
            content=f"""
{system_prompt}

DATABASE CONTEXT:
{db_context}

RAG CONTEXT:
{rag_context}
"""
        )
    )

    # Previous Conversation
    for msg in conversation_history:

        if msg["role"] == "user":
            messages.append(
                HumanMessage(content=msg["content"])
            )

        else:
            messages.append(
                AIMessage(content=msg["content"])
            )

    # Current Question
    messages.append(
        HumanMessage(content=question)
    )

    return messages