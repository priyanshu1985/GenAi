from fastapi import APIRouter, Header
from config import supabase
from utils import success

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/me")
def get_current_user(x_user_id: str = Header(...)):
    user = supabase.table("users").select("*").eq("id", x_user_id).execute()
    return success(user.data[0])
