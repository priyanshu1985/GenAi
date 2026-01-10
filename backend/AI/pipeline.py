"""
AI Pipeline Module
Orchestrates the complete STT → LLM → TTS pipeline for voice interactions.
"""

from typing import Optional
from AI.stt import speech_to_text
from AI.llm import generate_text
from AI.tts import text_to_speech
from AI.profiles import (
    get_child_profile,
    get_profile_context,
    increment_sessions,
    ChildProfile
)


def voice_to_voice(
    audio_bytes: bytes,
    child_id: Optional[str] = None
) -> dict:
    """
    Complete voice-to-voice pipeline:
    1. Speech-to-Text (STT) - Transcribe child's audio
    2. LLM Reasoning - Generate personalized response
    3. Text-to-Speech (TTS) - Convert response to audio

    Args:
        audio_bytes: Raw audio bytes from the child's recording
        child_id: Optional child ID for profile-based personalization

    Returns:
        Dictionary containing:
        - transcribed_text: What the child said
        - detected_language: Language of the input
        - ai_text_response: LLM's text response
        - audio_response: TTS output (base64 or metadata)
        - child_profile: Profile data if available
    """
    # Load child profile for personalization
    child_profile = None
    if child_id:
        child_profile = get_child_profile(child_id)

    # Step 1: Speech-to-Text
    transcribed_text, detected_language = speech_to_text(audio_bytes)

    if not transcribed_text:
        # Handle empty transcription
        return {
            "success": False,
            "error": "Could not transcribe audio. Please try again.",
            "transcribed_text": "",
            "detected_language": "unknown",
            "ai_text_response": "",
            "audio_response": None
        }

    # Use child's preferred language if available, otherwise use detected
    response_language = detected_language
    if child_profile and child_profile.preferred_language:
        response_language = child_profile.preferred_language

    # Step 2: LLM Reasoning
    ai_text_response = generate_text(
        user_text=transcribed_text,
        child_id=child_id,
        child_profile=child_profile
    )

    # Step 3: Text-to-Speech
    audio_response = text_to_speech(
        text=ai_text_response,
        language=response_language,
        return_type="base64"
    )

    # Increment session count for the child
    if child_id:
        increment_sessions(child_id)

    # Build response
    response = {
        "success": True,
        "transcribed_text": transcribed_text,
        "detected_language": detected_language,
        "ai_text_response": ai_text_response,
        "audio_response": audio_response,
        "response_language": response_language
    }

    # Include child profile summary if available
    if child_profile:
        response["child_profile"] = {
            "name": child_profile.name,
            "age": child_profile.age,
            "preferred_language": child_profile.preferred_language,
            "learning_level": child_profile.learning_level
        }

    return response


def interact(
    audio_bytes: bytes,
    child_id: str
) -> dict:
    """
    Main interaction endpoint handler.
    Wrapper around voice_to_voice with consistent response format.

    Args:
        audio_bytes: Raw audio bytes from the upload
        child_id: Child identifier for profile lookup

    Returns:
        Standardized response dictionary
    """
    return voice_to_voice(audio_bytes, child_id)


def text_interaction(
    user_text: str,
    child_id: Optional[str] = None
) -> dict:
    """
    Text-only interaction (skips STT step).
    Useful for testing or text-based input.

    Args:
        user_text: Text input from the user
        child_id: Optional child ID for personalization

    Returns:
        Dictionary with AI response and optional audio
    """
    # Load child profile
    child_profile = None
    response_language = "hindi"  # Default

    if child_id:
        child_profile = get_child_profile(child_id)
        if child_profile:
            response_language = child_profile.preferred_language

    # Generate LLM response
    ai_text_response = generate_text(
        user_text=user_text,
        child_id=child_id,
        child_profile=child_profile
    )

    # Generate audio
    audio_response = text_to_speech(
        text=ai_text_response,
        language=response_language,
        return_type="base64"
    )

    return {
        "success": True,
        "input_text": user_text,
        "ai_text_response": ai_text_response,
        "audio_response": audio_response,
        "response_language": response_language
    }


def get_greeting(child_id: Optional[str] = None) -> dict:
    """
    Generate a personalized greeting for a child.
    Called when starting a new learning session.

    Args:
        child_id: Optional child ID for personalization

    Returns:
        Greeting text and audio
    """
    child_profile = None
    language = "hindi"
    greeting_prompt = "Say a warm, friendly hello to a child starting their learning session."

    if child_id:
        child_profile = get_child_profile(child_id)
        if child_profile:
            language = child_profile.preferred_language
            greeting_prompt = f"Say a warm hello to {child_profile.name}, a {child_profile.age}-year-old child starting their learning session. Be encouraging and mention something fun to learn today."

    # Generate greeting
    greeting_text = generate_text(
        user_text=greeting_prompt,
        child_id=child_id,
        child_profile=child_profile
    )

    # Generate audio
    audio_response = text_to_speech(
        text=greeting_text,
        language=language,
        return_type="base64"
    )

    return {
        "success": True,
        "greeting_text": greeting_text,
        "audio_response": audio_response,
        "language": language,
        "child_name": child_profile.name if child_profile else None
    }
