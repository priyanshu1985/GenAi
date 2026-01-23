"""
AI Routes Module
Defines API endpoints for AI-powered learning interactions with multi-language support.
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, Header, HTTPException, Request
from typing import Optional
from pydantic import BaseModel

from middlewares.role_gaurd import teacher_only
from services.ai_service import (
    voice_to_voice_with_logging,
    process_interact,
    process_text_interaction,
    get_session_greeting,
    get_child_info,
    get_available_children
)
from utils import success, error
from utils.language_utils import (
    get_request_language_dependency,
    create_language_aware_prompt,
    LanguageMiddleware
)

router = APIRouter(prefix="/ai", tags=["AI"])


# Pydantic models for request/response validation
class TextInteractionRequest(BaseModel):
    text: str
    child_id: Optional[str] = None
    language: Optional[str] = None  # Optional override for language


class GreetingRequest(BaseModel):
    child_id: Optional[str] = None


# ============================================================
# MAIN INTERACTION ENDPOINT (as per requirements)
# ============================================================

@router.post("/interact")
async def interact_endpoint(
    file: UploadFile = File(..., description="Audio file (WAV format)"),
    child_id: str = Form(..., description="Child ID for personalization")
):
    """
    Main voice interaction endpoint.

    Pipeline: STT → LLM → TTS

    - Accepts: audio file (WAV) + child_id
    - Returns: transcribed_text, ai_text_response, audio_response (base64)
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.wav', '.mp3', '.ogg', '.webm', '.m4a')):
            return error("Invalid audio format. Please upload WAV, MP3, OGG, WebM, or M4A file.", 400)

        # Read audio bytes
        audio_bytes = await file.read()

        if len(audio_bytes) == 0:
            return error("Empty audio file received.", 400)

        # Process the interaction
        result = process_interact(audio_bytes, child_id)

        return success(result)

    except Exception as e:
        print(f"Interact endpoint error: {str(e)}")
        return error(f"Failed to process interaction: {str(e)}", 500)


# ============================================================
# LEGACY VOICE ENDPOINT (for backward compatibility)
# ============================================================

@router.post("/voice", dependencies=[Depends(teacher_only)])
async def ai_voice(
    file: UploadFile,
    x_user_id: str = Header(...),
    x_child_id: Optional[str] = Header(None)
):
    """
    Voice interaction with teacher authentication.
    Logs interactions to database.
    """
    try:
        audio = await file.read()
        result = voice_to_voice_with_logging(audio, x_user_id, x_child_id)
        return success(result)
    except Exception as e:
        print(f"Voice endpoint error: {str(e)}")
        return error(f"Failed to process voice: {str(e)}", 500)


# ============================================================
# TEXT INTERACTION ENDPOINT
# ============================================================

@router.post("/text")
async def text_interaction_endpoint(
    request_data: TextInteractionRequest,
    http_request: Request,
    language: str = Depends(get_request_language_dependency)
):
    """
    Text-only interaction with multi-language support.
    Language is detected from Accept-Language header or request body.
    """
    try:
        # Use language from request body if provided, otherwise use detected language
        target_language = request_data.language or language
        
        # Log language information
        LanguageMiddleware.log_language_info(http_request, target_language, "/ai/text")
        
        # Create language-aware prompt
        enhanced_text = create_language_aware_prompt(
            base_prompt=request_data.text,
            language=target_language,
            context="Child learning session at Anganwadi center"
        )
        
        # Process with language context
        result = process_text_interaction(
            text=enhanced_text,
            child_id=request_data.child_id,
            language=target_language
        )
        
        # Add language info to response
        if isinstance(result, dict):
            result["detected_language"] = target_language
            result["original_text"] = request_data.text
        
        return success(result)
    except Exception as e:
        print(f"Text interaction error: {str(e)}")
        return error(f"Failed to process text: {str(e)}", 500)


# ============================================================
# GREETING ENDPOINT
# ============================================================

@router.post("/greeting")
async def greeting_endpoint(request: GreetingRequest):
    """
    Get a personalized greeting for starting a learning session.
    """
    try:
        result = get_session_greeting(request.child_id)
        return success(result)
    except Exception as e:
        print(f"Greeting error: {str(e)}")
        return error(f"Failed to generate greeting: {str(e)}", 500)


@router.get("/greeting/{child_id}")
async def get_greeting_for_child(child_id: str):
    """
    Get greeting for a specific child (GET method for convenience).
    """
    try:
        result = get_session_greeting(child_id)
        return success(result)
    except Exception as e:
        return error(f"Failed to generate greeting: {str(e)}", 500)


# ============================================================
# CHILD PROFILE ENDPOINTS
# ============================================================

@router.get("/children")
async def list_children():
    """
    Get list of all available child profiles.
    Useful for demo and testing.
    """
    try:
        result = get_available_children()
        return success(result)
    except Exception as e:
        return error(f"Failed to get children: {str(e)}", 500)


@router.get("/child/{child_id}")
async def get_child_profile_endpoint(child_id: str):
    """
    Get profile for a specific child.
    """
    try:
        result = get_child_info(child_id)
        if result.get("success"):
            return success(result)
        else:
            return error(result.get("error", "Child not found"), 404)
    except Exception as e:
        return error(f"Failed to get child profile: {str(e)}", 500)


# ============================================================
# HEALTH CHECK
# ============================================================

@router.get("/health")
async def ai_health():
    """
    Check AI service health and configuration.
    """
    from config import get_config_summary

    return success({
        "status": "healthy",
        "config": get_config_summary()
    })
