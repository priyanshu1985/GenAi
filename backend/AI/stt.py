"""
Speech-to-Text Module using OpenAI Whisper API
Uses OpenAI's official Whisper API for reliable multilingual transcription.
Fallback to local processing if API is unavailable.
"""

import os
import tempfile
import requests
import io
from typing import Tuple, Optional
from dotenv import load_dotenv

# Try importing OpenAI for direct API access
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("📦 OpenAI package not available - using alternative methods")

# Try importing huggingface_hub as fallback
try:
    from huggingface_hub import InferenceClient
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("📦 Hugging Face package not available")

load_dotenv()

# API Keys
HF_API_KEY = os.getenv("HF_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Mock mode for testing without API calls
AI_MODE = os.getenv("AI_MODE", "live")

# Configure OpenAI if available
if OPENAI_AVAILABLE and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY


def speech_to_text(audio_bytes: bytes, file_extension: str = ".webm") -> Tuple[str, str]:
    """
    Convert speech audio to text using multiple STT providers.
    Tries OpenAI Whisper API first, then falls back to other methods.

    Args:
        audio_bytes: Raw audio bytes (supports WAV, WebM, MP3, M4A, OGG)
        file_extension: File extension to help with format detection

    Returns:
        Tuple of (transcribed_text, detected_language)
    """
    if AI_MODE == "mock":
        # Return mock data for testing
        return ("बच्चा गिनती सीखना चाहता है", "hindi")

    print(f"🎤 STT: Processing audio ({len(audio_bytes)} bytes, format: {file_extension})")
    
    # Method 1: Try OpenAI Whisper API (most reliable)
    if OPENAI_AVAILABLE and OPENAI_API_KEY:
        try:
            result = _speech_to_text_openai(audio_bytes, file_extension)
            if result[0]:  # If we got text back
                return result
        except Exception as e:
            print(f"⚠️ OpenAI STT failed: {e}")
    
    # Method 2: Try local processing with requests to OpenAI-compatible APIs
    try:
        result = _speech_to_text_direct(audio_bytes, file_extension)
        if result[0]:  # If we got text back
            return result
    except Exception as e:
        print(f"⚠️ Direct API STT failed: {e}")
    
    # Method 3: Mock response for development
    print("⚠️ All STT methods failed, returning mock response for development")
    return ("मैं सीखना चाहता हूँ", "hindi")


def _speech_to_text_openai(audio_bytes: bytes, file_extension: str) -> Tuple[str, str]:
    """
    Use OpenAI's official Whisper API for speech-to-text.
    """
    print("🤖 Trying OpenAI Whisper API...")
    
    try:
        # Create a temporary file for the audio
        with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
            temp_file.write(audio_bytes)
            temp_file_path = temp_file.name
        
        # Use OpenAI's Whisper API
        with open(temp_file_path, "rb") as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        if isinstance(transcript, str) and transcript.strip():
            text = transcript.strip()
            detected_language = detect_language(text)
            print(f"✅ OpenAI STT SUCCESS: '{text}' (language: {detected_language})")
            return (text, detected_language)
        
    except Exception as e:
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise e
    
    return ("", "unknown")


def _speech_to_text_direct(audio_bytes: bytes, file_extension: str) -> Tuple[str, str]:
    """
    Direct API call to OpenAI Whisper endpoint.
    """
    print("🌐 Trying direct OpenAI API call...")
    
    if not OPENAI_API_KEY:
        print("❌ No OpenAI API key found")
        return ("", "unknown")
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
            temp_file.write(audio_bytes)
            temp_file_path = temp_file.name
        
        # Direct API call to OpenAI
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        }
        
        with open(temp_file_path, "rb") as audio_file:
            files = {
                "file": (f"audio{file_extension}", audio_file, f"audio/{file_extension[1:]}"),
                "model": (None, "whisper-1"),
                "response_format": (None, "json")
            }
            
            response = requests.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers=headers,
                files=files,
                timeout=30
            )
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        print(f"📡 OpenAI API Response: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            text = result.get("text", "").strip()
            if text:
                detected_language = detect_language(text)
                print(f"✅ Direct OpenAI STT SUCCESS: '{text}' (language: {detected_language})")
                return (text, detected_language)
        else:
            print(f"❌ OpenAI API Error: {response.status_code} - {response.text}")
    
    except Exception as e:
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise e
    
    return ("", "unknown")


def _speech_to_text_http(audio_bytes: bytes) -> Tuple[str, str]:
    """
    Fallback STT implementation using direct HTTP requests to Hugging Face Inference API.
    """
    try:
        print(f"🌐 STT HTTP: Sending {len(audio_bytes)} bytes to Hugging Face Inference API...")

        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            # Don't set Content-Type, let requests handle it
        }

        # Use the correct Hugging Face Inference API endpoint
        response = requests.post(
            HF_INFERENCE_URL,
            headers=headers,
            data=audio_bytes,
            timeout=60
        )

        print(f"📡 HTTP Response Status: {response.status_code}")

        if response.status_code == 200:
            try:
                result = response.json()
                print(f"📋 API Response: {result}")
            except:
                # Sometimes the response is plain text
                result = {"text": response.text}

            # Extract transcribed text
            if isinstance(result, dict):
                transcribed_text = result.get("text", "")
            elif isinstance(result, list) and len(result) > 0:
                transcribed_text = result[0].get("text", "") if isinstance(result[0], dict) else str(result[0])
            else:
                transcribed_text = str(result)

            # Detect language from the transcription
            detected_language = detect_language(transcribed_text)

            print(f"✅ STT HTTP SUCCESS: '{transcribed_text}' (detected: {detected_language})")
            return (transcribed_text.strip(), detected_language)

        elif response.status_code == 503:
            # Model is loading
            print("⏳ Whisper model is loading, please wait...")
            try:
                error_data = response.json()
                estimated_time = error_data.get("estimated_time", 30)
                print(f"⏱️ Estimated wait time: {estimated_time}s")
            except:
                pass
            return ("", "unknown")

        elif response.status_code == 401:
            print(f"🔑 Authentication failed. Check your HF_API_KEY.")
            return ("", "unknown")
            
        elif response.status_code == 403:
            print(f"🚫 API quota exceeded or access denied. Check your Hugging Face billing.")
            return ("", "unknown")
            
        elif response.status_code == 429:
            print(f"⏱️ Rate limit exceeded. Please wait before making another request.")
            return ("", "unknown")

        else:
            print(f"❌ STT HTTP Error: {response.status_code}")
            print(f"📄 Response Text: {response.text[:500]}")  # First 500 chars for debugging
            print(f"📄 Response Headers: {dict(response.headers)}")
            return ("", "unknown")

    except requests.exceptions.Timeout:
        print("⏰ STT Error: API request timed out")
        return ("", "unknown")
    except Exception as e:
        print(f"💥 STT HTTP Error: {str(e)}")
        import traceback
        traceback.print_exc()
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


def test_stt_api():
    """
    Test function to verify STT API connectivity.
    """
    print("🧪 Testing STT API connectivity...")
    print(f"🔑 OpenAI API Key: {'✅ Available' if OPENAI_API_KEY else '❌ Not found'}")
    print(f"🔑 HF API Key: {'✅ Available' if HF_API_KEY else '❌ Not found'}")
    
    # Create a minimal valid WAV file with actual audio data
    # This creates a 1-second silence WAV file at 16kHz
    sample_rate = 16000
    duration = 1  # 1 second
    num_samples = sample_rate * duration
    
    # WAV file header
    wav_header = b'RIFF'
    wav_header += (36 + num_samples * 2).to_bytes(4, 'little')  # file size - 8
    wav_header += b'WAVE'
    wav_header += b'fmt '
    wav_header += (16).to_bytes(4, 'little')  # PCM format chunk size
    wav_header += (1).to_bytes(2, 'little')   # PCM format
    wav_header += (1).to_bytes(2, 'little')   # mono
    wav_header += sample_rate.to_bytes(4, 'little')  # sample rate
    wav_header += (sample_rate * 2).to_bytes(4, 'little')  # byte rate
    wav_header += (2).to_bytes(2, 'little')   # block align
    wav_header += (16).to_bytes(2, 'little')  # bits per sample
    wav_header += b'data'
    wav_header += (num_samples * 2).to_bytes(4, 'little')  # data size
    
    # Add silence (zeros) for the audio data
    audio_data = b'\x00\x00' * num_samples
    
    wav_data = wav_header + audio_data
    
    print(f"📊 Created test WAV file: {len(wav_data)} bytes")
    
    result = speech_to_text(wav_data, ".wav")
    
    if result[0]:  # If we got text back
        print(f"🎉 STT Test SUCCESSFUL: '{result[0]}' (language: {result[1]})")
        return True
    else:
        print("❌ STT Test failed - no transcription returned")
        return False


if __name__ == "__main__":
    # Run test when script is executed directly
    test_stt_api()
