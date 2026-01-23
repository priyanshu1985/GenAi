# User language management routes
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from utils.language_utils import get_request_language_dependency
from services.supabase_service import supabase

router = APIRouter(prefix="/user", tags=["User"])

class LanguageUpdateRequest(BaseModel):
    language: str
    userId: str

class LanguageResponse(BaseModel):
    success: bool
    language: str
    message: str

@router.put("/language")
async def update_user_language(
    request_data: LanguageUpdateRequest,
    http_request: Request,
    current_language: str = Depends(get_request_language_dependency)
):
    """
    Update user's language preference in Supabase.
    
    Args:
        request_data: Language update request
        http_request: FastAPI request object
        current_language: Current language from headers
    
    Returns:
        Language update confirmation
    """
    try:
        # Validate language
        valid_languages = ['hi', 'en', 'te']
        if request_data.language not in valid_languages:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid language. Supported: {valid_languages}"
            )
        
        # Update user language in Supabase
        result = supabase.table("users").update({
            "language": request_data.language
        }).eq("id", request_data.userId).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="User not found or update failed"
            )
        
        print(f"🌐 Updated user {request_data.userId} language to: {request_data.language}")
        
        return LanguageResponse(
            success=True,
            language=request_data.language,
            message="Language preference updated successfully"
        )
        
    except Exception as e:
        print(f"❌ Language update error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update language preference: {str(e)}"
        )

@router.get("/language/{user_id}")
async def get_user_language(user_id: str):
    """
    Get user's language preference from Supabase.
    
    Args:
        user_id: User ID
    
    Returns:
        User's language preference
    """
    try:
        result = supabase.table("users").select("language, email").eq("id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        user_data = result.data[0]
        language = user_data.get("language", "hi")
        
        return {
            "success": True,
            "language": language,
            "email": user_data.get("email"),
            "user_id": user_id
        }
        
    except Exception as e:
        print(f"❌ Get language error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get language preference: {str(e)}"
        )