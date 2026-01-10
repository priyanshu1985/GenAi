"""
AI Service Module
Handles AI-related business logic and database logging.
"""

from AI.stt import speech_to_text
from AI.llm import generate_text
from AI.tts import text_to_speech
from AI.pipeline import voice_to_voice, interact, text_interaction, get_greeting
from AI.profiles import get_child_profile, get_profile_context
from services.supabase_service import supabase


def voice_to_voice_with_logging(audio: bytes, user_id: str, child_id: str = None) -> dict:
    """
    Process voice interaction with database logging.

    Args:
        audio: Raw audio bytes
        user_id: ID of the user (teacher) making the request
        child_id: Optional child ID for personalization

    Returns:
        Complete interaction result
    """
    # Use child_id if provided, otherwise fall back to user_id
    effective_child_id = child_id or user_id

    # Run the pipeline
    result = voice_to_voice(audio, effective_child_id)

    # Log the interaction to Supabase
    try:
        log_entry = {
            "user_id": user_id,
            "child_id": effective_child_id,
            "input": result.get("transcribed_text", ""),
            "output": result.get("ai_text_response", ""),
            "detected_language": result.get("detected_language", "unknown"),
            "response_language": result.get("response_language", "hindi"),
            "success": result.get("success", False)
        }

        supabase.table("ai_logs").insert(log_entry).execute()
    except Exception as e:
        print(f"Failed to log AI interaction: {str(e)}")
        # Don't fail the request if logging fails

    return result


def process_interact(audio: bytes, child_id: str) -> dict:
    """
    Main /interact endpoint handler.

    Args:
        audio: Raw audio bytes from upload
        child_id: Child identifier

    Returns:
        Standardized response with transcribed_text, ai_text_response, audio_response
    """
    result = interact(audio, child_id)

    # Format response for API
    return {
        "transcribed_text": result.get("transcribed_text", ""),
        "ai_text_response": result.get("ai_text_response", ""),
        "audio_response": result.get("audio_response", {}),
        "detected_language": result.get("detected_language", "unknown"),
        "child_profile": result.get("child_profile")
    }


def process_text_interaction(text: str, child_id: str = None) -> dict:
    """
    Text-only interaction endpoint handler.

    Args:
        text: Text input
        child_id: Optional child ID

    Returns:
        AI response with optional audio
    """
    return text_interaction(text, child_id)


def get_session_greeting(child_id: str = None) -> dict:
    """
    Get a personalized greeting for starting a session.

    Args:
        child_id: Optional child ID

    Returns:
        Greeting with audio
    """
    return get_greeting(child_id)


def get_child_info(child_id: str) -> dict:
    """
    Get child profile information.

    Args:
        child_id: Child identifier

    Returns:
        Child profile data or error
    """
    profile = get_child_profile(child_id)

    if profile:
        return {
            "success": True,
            "profile": profile.to_dict()
        }
    else:
        return {
            "success": False,
            "error": "Child profile not found"
        }


def get_available_children() -> dict:
    """
    Get list of all available child profiles.
    Useful for testing and demo purposes.

    Returns:
        List of child profile summaries
    """
    from AI.profiles import CHILD_PROFILES

    children = []
    for child_id, profile in CHILD_PROFILES.items():
        children.append({
            "child_id": child_id,
            "name": profile.name,
            "age": profile.age,
            "preferred_language": profile.preferred_language,
            "learning_level": profile.learning_level
        })

    return {
        "success": True,
        "children": children,
        "count": len(children)
    }
