import jwt
from config import JWT_SECRET
from services.supabase_service import supabase

def get_user_from_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")

        # Skip Supabase for now, return mock user for testing
        if supabase is None:
            return {
                "id": user_id,
                "role": "teacher",
                "name": "Test User"
            }
        
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        return response.data

    except Exception as e:
        print(f"Auth error: {e}")
        return None