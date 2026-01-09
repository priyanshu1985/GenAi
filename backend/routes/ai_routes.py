from fastapi import APIRouter, UploadFile, Depends, Header
from middlewares.role_gaurd import teacher_only
from services.ai_service import voice_to_voice
from utils import success

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/voice", dependencies=[Depends(teacher_only)])
async def ai_voice(
    file: UploadFile,
    x_user_id: str = Header(...)
):
    audio = await file.read()
    result = voice_to_voice(audio, x_user_id)
    return success(result)
