from langchain_groq import ChatGroq

from config import GROQ_API_KEY
from services.memory import (
    get_messages,
    add_user_message,
    add_ai_message
)
from services.retriever import retrieve_documents


llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.1-8b-instant",
    temperature=0.3
)


SYSTEM_PROMPT = """
You are MediCare AI Assistant for a medical and pharmacy website.

RULES:
- Speak naturally and clearly.
- Do NOT call user doctor.
- Do NOT repeatedly greet user.
- Keep answers concise and modern.
- Use simple formatting.
- Answer directly.
- If report values are normal, clearly say they are normal.
- Use bullet points when useful.
- Be friendly but not overly formal.
- Prices are in rupees.
- Never use markdown syntax.
- Format responses in clean readable plain text.
- If you don't have information then don't lie or generate anything false like address and contacts etc.
- Only give responses related to my website and the user's query.
- Don't answer unrelated questions.
- Don't confuse website information with user information.
- Keep responses short by default.
- Expand only if the user asks.
- Never mention database access.
- dont tell steps to make payments and login etc . if user ask for "how to do payment" then tell to checkout from cart . 
- dont create false answer like in 1 question user asked how to pay and ans given correct but the wrong thing said is checkout option in right corner , whoch doesnt exist . so dont do such things
- if you dont have data from db to verify what user is saying then dont directly keep trust on it . play safe . for ex - if user says payment is done then dont say - Your payment has been successful. You can now proceed to download your lab test reports or schedule a new appointment from your account dashboard , because you not have verified it we cant trust on that and dont give orders that check email if you dont know email is send . dont hallucinate and instead say like somethings like this "if payment is paid then you will be updated about next ...."
"""


async def ask_llm(conversation_id, question, db_context):

    # Retrieve RAG documents
    documents = retrieve_documents(question)

    rag_context = "\n\n".join(
        doc.page_content for doc in documents
    )

    history = get_messages(conversation_id)

    messages = [
        (
            "system",
            f"""
{SYSTEM_PROMPT}

DATABASE CONTEXT:
{db_context}

RAG CONTEXT:
{rag_context}
"""
        )
    ]

    # Previous conversation
    messages.extend(history)

    # Current question
    messages.append(("human", question))

    response = llm.invoke(messages)

    add_user_message(conversation_id, question)
    add_ai_message(conversation_id, response.content)

    return response.content