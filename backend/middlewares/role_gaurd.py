from fastapi import Header, HTTPException
from services.supabase_service import supabase
from config import ALLOWED_AI_ROLE

def teacher_only(x_user_id: str = Header(...)):
    user = supabase.table("users").select("role").eq("id", x_user_id).execute()

    if not user.data or user.data[0]["role"] != ALLOWED_AI_ROLE:
        raise HTTPException(
            status_code=403,
            detail="AI access allowed only for teachers"
        )

