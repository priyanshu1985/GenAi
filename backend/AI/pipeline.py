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
    print("=" * 50)
    print("PIPELINE: voice_to_voice started")
    print(f"Audio bytes received: {len(audio_bytes)} bytes")
    print(f"Child ID: {child_id}")

    # Load child profile for personalization
    child_profile = None
    if child_id:
        child_profile = get_child_profile(child_id)
        print(f"Child profile loaded: {child_profile.name if child_profile else 'None'}")

    # Step 1: Speech-to-Text
    print("\n--- STEP 1: Speech-to-Text ---")
    transcribed_text, detected_language = speech_to_text(audio_bytes)
    print(f"Transcribed text: '{transcribed_text}'")
    print(f"Detected language: {detected_language}")

    if not transcribed_text:
        # Handle empty transcription
        print("ERROR: Empty transcription, returning error response")
        return {
            "success": False,
            "error": "Could not transcribe audio. Please try again.",
            "transcribed_text": "",
            "detected_language": "unknown",
            "ai_text_response": "I didn't understand that. Could you try again?",
            "audio_response": text_to_speech("I didn't understand that. Could you try again?", "english", "base64")
        }

    # Use child's preferred language if available, otherwise use detected
    response_language = detected_language
    if child_profile and child_profile.preferred_language:
        response_language = child_profile.preferred_language
    print(f"Response language: {response_language}")

    # Step 2: LLM Reasoning
    print("\n--- STEP 2: LLM Reasoning ---")
    ai_text_response = generate_text(
        user_text=transcribed_text,
        child_id=child_id,
        child_profile=child_profile
    )
    print(f"AI text response: '{ai_text_response}'")

    # Step 3: Text-to-Speech
    print("\n--- STEP 3: Text-to-Speech ---")
    audio_response = text_to_speech(
        text=ai_text_response,
        language=response_language,
        return_type="base64"
    )
    print(f"Audio response type: {audio_response.get('tts_type', 'unknown')}")
    print(f"Audio response has text: {bool(audio_response.get('text'))}")

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

    print("\n--- PIPELINE COMPLETE ---")
    print(f"Success: {response['success']}")
    print("=" * 50)

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
    print("=" * 50)
    print("PIPELINE: text_interaction started")
    print(f"Input text: '{user_text}'")
    print(f"Child ID: {child_id}")
    
    # Load child profile
    child_profile = None
    response_language = "hindi"  # Default

    if child_id:
        print(f"📋 Loading child profile for: {child_id}")
        child_profile = get_child_profile(child_id)
        if child_profile:
            response_language = child_profile.preferred_language
            print(f"✅ Child profile loaded: {child_profile.name}, language: {response_language}")
        else:
            print(f"⚠️ No child profile found for: {child_id}")
    else:
        print("ℹ️ No child ID provided, using defaults")

    # Generate LLM response
    print("\n--- STEP 1: LLM Generation ---")
    ai_text_response = generate_text(
        user_text=user_text,
        child_id=child_id,
        child_profile=child_profile
    )
    print(f"AI response: '{ai_text_response}'")

    # Generate audio
    print("\n--- STEP 2: TTS Generation ---")
    audio_response = text_to_speech(
        text=ai_text_response,
        language=response_language,
        return_type="base64"
    )
    print(f"Audio response type: {audio_response.get('tts_type', 'unknown')}")

    result = {
        "success": True,
        "input_text": user_text,
        "ai_text_response": ai_text_response,
        "audio_response": audio_response,
        "response_language": response_language
    }
    
    print("\n--- PIPELINE COMPLETE ---")
    print(f"Success: {result['success']}")
    print("=" * 50)

    return result


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
