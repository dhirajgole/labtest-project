from fastapi import APIRouter
from pydantic import BaseModel

from services.rag_service import ask_llm

router = APIRouter()


class ChatRequest(BaseModel):
    conversation_id: str
    question: str
    db_context: str


@router.post("/chat")
async def chat(request: ChatRequest):

    answer = await ask_llm(
        conversation_id=request.conversation_id,
        question=request.question,
        db_context=request.db_context
    )

    return {
        "answer": answer
    }