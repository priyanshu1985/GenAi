"""
Speech-to-Text Module using Hugging Face Inference API
Uses OpenAI Whisper-small model for multilingual transcription.
"""

import os
import tempfile
from typing import Tuple, Optional
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

# Initialize Hugging Face Inference Client
HF_API_KEY = os.getenv("HF_API_KEY")
client = InferenceClient(token=HF_API_KEY)

# Whisper model for speech recognition
WHISPER_MODEL = "openai/whisper-small"

# Mock mode for testing without API calls
AI_MODE = os.getenv("AI_MODE", "live")


def speech_to_text(audio_bytes: bytes) -> Tuple[str, str]:
    """
    Convert speech audio to text using Hugging Face Whisper.

    Args:
        audio_bytes: Raw audio bytes (WAV format preferred)

    Returns:
        Tuple of (transcribed_text, detected_language)
    """
    if AI_MODE == "mock":
        # Return mock data for testing
        return ("बच्चा गिनती सीखना चाहता है", "hindi")

    try:
        # Write audio bytes to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        try:
            # Use Hugging Face Inference API for transcription
            result = client.automatic_speech_recognition(
                audio=temp_path,
                model=WHISPER_MODEL
            )

            # Extract transcribed text
            if isinstance(result, dict):
                transcribed_text = result.get("text", "")
            else:
                transcribed_text = str(result)

            # Detect language from the transcription
            detected_language = detect_language(transcribed_text)

            return (transcribed_text.strip(), detected_language)

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    except Exception as e:
        print(f"STT Error: {str(e)}")
        # Return empty result on error
        return ("", "unknown")


def detect_language(text: str) -> str:
    """
    Simple language detection based on Unicode character ranges.
    For production, consider using a proper language detection library.

    Args:
        text: The transcribed text

    Returns:
        Detected language code (hindi, english, tamil, telugu, etc.)
    """
    if not text:
        return "unknown"

    # Count characters in different scripts
    devanagari_count = 0  # Hindi, Marathi, Sanskrit
    tamil_count = 0
    telugu_count = 0
    kannada_count = 0
    malayalam_count = 0
    latin_count = 0
    total_alpha = 0

    for char in text:
        code_point = ord(char)

        # Devanagari script (Hindi, Marathi, etc.)
        if 0x0900 <= code_point <= 0x097F:
            devanagari_count += 1
            total_alpha += 1
        # Tamil script
        elif 0x0B80 <= code_point <= 0x0BFF:
            tamil_count += 1
            total_alpha += 1
        # Telugu script
        elif 0x0C00 <= code_point <= 0x0C7F:
            telugu_count += 1
            total_alpha += 1
        # Kannada script
        elif 0x0C80 <= code_point <= 0x0CFF:
            kannada_count += 1
            total_alpha += 1
        # Malayalam script
        elif 0x0D00 <= code_point <= 0x0D7F:
            malayalam_count += 1
            total_alpha += 1
        # Latin/ASCII (English)
        elif char.isalpha():
            latin_count += 1
            total_alpha += 1

    if total_alpha == 0:
        return "unknown"

    # Determine primary language based on script prevalence
    script_counts = {
        "hindi": devanagari_count,
        "tamil": tamil_count,
        "telugu": telugu_count,
        "kannada": kannada_count,
        "malayalam": malayalam_count,
        "english": latin_count
    }

    primary_language = max(script_counts, key=script_counts.get)

    # If Latin characters dominate, it's likely English
    if script_counts[primary_language] > 0:
        return primary_language

    return "english"  # Default to English


def transcribe_with_timestamps(audio_bytes: bytes) -> dict:
    """
    Extended transcription with word-level timestamps (if available).
    Useful for educational applications tracking pronunciation.

    Args:
        audio_bytes: Raw audio bytes

    Returns:
        Dictionary with text, language, and optional timestamps
    """
    text, language = speech_to_text(audio_bytes)

    return {
        "text": text,
        "language": language,
        "timestamps": [],  # Timestamps would be populated if the model supports it
        "confidence": 0.95 if text else 0.0  # Placeholder confidence score
    }
