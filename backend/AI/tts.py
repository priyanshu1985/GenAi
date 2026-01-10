"""
Text-to-Speech Module
Supports multiple backends:
1. Hugging Face Inference API (when available)
2. Browser-based Web Speech API (fallback - always works)

For hackathon demos, browser TTS is reliable and supports Indian languages.
"""

import os
import base64
import requests
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Hugging Face API configuration
HF_API_KEY = os.getenv("HF_API_KEY")
HF_API_URL = "https://api-inference.huggingface.co/models/"

# TTS models for different languages
TTS_MODELS = {
    "hindi": "facebook/mms-tts-hin",
    "english": "facebook/mms-tts-eng",
    "tamil": "facebook/mms-tts-tam",
    "telugu": "facebook/mms-tts-tel",
    "kannada": "facebook/mms-tts-kan",
    "malayalam": "facebook/mms-tts-mal",
    "default": "facebook/mms-tts-hin"
}

# BCP 47 language tags for Web Speech API
LANGUAGE_TAGS = {
    "hindi": "hi-IN",
    "english": "en-IN",
    "tamil": "ta-IN",
    "telugu": "te-IN",
    "kannada": "kn-IN",
    "malayalam": "ml-IN",
    "marathi": "mr-IN",
    "bengali": "bn-IN",
    "gujarati": "gu-IN",
    "punjabi": "pa-IN"
}

# Mock mode for testing
AI_MODE = os.getenv("AI_MODE", "live")

# Set to True to always use browser TTS (more reliable for demos)
USE_BROWSER_TTS = os.getenv("USE_BROWSER_TTS", "true").lower() == "true"


def text_to_speech(
    text: str,
    language: str = "hindi",
    return_type: str = "base64"
) -> dict:
    """
    Convert text to speech.

    Primary: Try Hugging Face API
    Fallback: Browser-based TTS (Web Speech API)

    Args:
        text: The text to convert to speech
        language: Target language for speech synthesis
        return_type: "base64" for base64-encoded audio, "file" for file path

    Returns:
        Dictionary with audio data or browser TTS instructions
    """
    if AI_MODE == "mock":
        return browser_tts_response(text, language, "Mock mode")

    # For reliability in demos, use browser TTS by default
    if USE_BROWSER_TTS:
        return browser_tts_response(text, language, "Browser TTS mode enabled")

    # Try Hugging Face API
    try:
        model = TTS_MODELS.get(language.lower(), TTS_MODELS["default"])
        api_url = f"{HF_API_URL}{model}"

        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {"inputs": text}

        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code == 200:
            audio_bytes = response.content

            if return_type == "base64":
                audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
                return {
                    "tts_type": "generated",
                    "text": text,
                    "language": language,
                    "language_tag": LANGUAGE_TAGS.get(language, "hi-IN"),
                    "audio_base64": audio_base64,
                    "audio_format": "flac",  # HF API returns FLAC
                    "model_used": model
                }
            else:
                return {
                    "tts_type": "generated",
                    "text": text,
                    "language": language,
                    "audio_bytes": audio_bytes,
                    "audio_format": "flac"
                }
        else:
            # API failed, use browser fallback
            error_msg = f"HF API returned {response.status_code}"
            print(f"TTS Error: {error_msg}")
            return browser_tts_response(text, language, error_msg)

    except requests.exceptions.Timeout:
        return browser_tts_response(text, language, "API timeout")
    except Exception as e:
        print(f"TTS Error: {str(e)}")
        return browser_tts_response(text, language, str(e))


def browser_tts_response(text: str, language: str, reason: str = "") -> dict:
    """
    Return browser-based TTS response.
    The frontend uses Web Speech API to speak the text.

    This is actually MORE reliable for Indian languages in demos!

    Args:
        text: The text to speak
        language: Target language
        reason: Why we're using browser TTS

    Returns:
        Dictionary for browser TTS
    """
    language_tag = LANGUAGE_TAGS.get(language.lower(), "hi-IN")

    return {
        "tts_type": "browser",
        "text": text,
        "language": language,
        "language_tag": language_tag,
        "audio_base64": None,
        "voice_config": {
            "lang": language_tag,
            "rate": 0.9,      # Slightly slower for children
            "pitch": 1.1,     # Slightly higher pitch for friendly tone
            "volume": 1.0
        },
        "message": f"Use browser Web Speech API for TTS. Reason: {reason}" if reason else "Use browser Web Speech API"
    }


def get_audio_bytes(text: str, language: str = "hindi") -> Optional[bytes]:
    """
    Get raw audio bytes for the given text.
    Returns None if using browser TTS.
    """
    result = text_to_speech(text, language, return_type="bytes")
    return result.get("audio_bytes")


def get_supported_languages() -> list:
    """Get list of supported languages."""
    return list(LANGUAGE_TAGS.keys())


def get_language_tag(language: str) -> str:
    """Get BCP 47 language tag for Web Speech API."""
    return LANGUAGE_TAGS.get(language.lower(), "hi-IN")


# Frontend JavaScript helper (for reference)
BROWSER_TTS_JS = """
// Frontend code to use browser TTS
function speakText(ttsResponse) {
    if (ttsResponse.tts_type === 'browser') {
        const utterance = new SpeechSynthesisUtterance(ttsResponse.text);
        utterance.lang = ttsResponse.language_tag || 'hi-IN';

        if (ttsResponse.voice_config) {
            utterance.rate = ttsResponse.voice_config.rate || 1.0;
            utterance.pitch = ttsResponse.voice_config.pitch || 1.0;
            utterance.volume = ttsResponse.voice_config.volume || 1.0;
        }

        speechSynthesis.speak(utterance);
    } else if (ttsResponse.tts_type === 'generated' && ttsResponse.audio_base64) {
        const audio = new Audio('data:audio/flac;base64,' + ttsResponse.audio_base64);
        audio.play();
    }
}
"""
