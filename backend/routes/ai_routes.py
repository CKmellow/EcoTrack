# routers/ai_routes.py
from fastapi import APIRouter, Depends
from services.ai_service import ask_ai
from services import auth_service

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat")
async def chat_with_ai(prompt: str, current_user=Depends(auth_service.get_current_user)):
    """
    Let logged-in users chat with Inflection AI.
    """
    reply = await ask_ai(prompt)
    return {"reply": reply}
