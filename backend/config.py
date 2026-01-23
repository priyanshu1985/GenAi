"""
Configuration Module
Loads and validates environment variables for the application.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET")

# Hugging Face Configuration
HF_API_KEY = os.getenv("HF_API_KEY")

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# AI Mode Configuration
# "live" = Use actual APIs
# "mock" = Use mock responses for testing
AI_MODE = os.getenv("AI_MODE", "live")

# Role-based access
ALLOWED_AI_ROLE = "teacher"

# Model Configuration
WHISPER_MODEL = "openai/whisper-small"
LLM_MODEL = "mistralai/mistral-7b-instruct"
TTS_MODEL_DEFAULT = "facebook/mms-tts-hin"


def validate_config() -> dict:
    """
    Validate that all required configuration values are present.
    Returns a dictionary with validation status and missing keys.
    """
    required_keys = {
        "SUPABASE_URL": SUPABASE_URL,
        "SUPABASE_KEY": SUPABASE_KEY,
        "JWT_SECRET": JWT_SECRET,
        "HF_API_KEY": HF_API_KEY,
        "OPENROUTER_API_KEY": OPENROUTER_API_KEY
    }

    missing = [key for key, value in required_keys.items() if not value]

    return {
        "valid": len(missing) == 0,
        "missing_keys": missing,
        "ai_mode": AI_MODE
    }


def get_config_summary() -> dict:
    """
    Get a summary of the current configuration (without exposing secrets).
    Useful for debugging and health checks.
    """
    return {
        "supabase_configured": bool(SUPABASE_URL and SUPABASE_KEY),
        "hf_configured": bool(HF_API_KEY),
        "openrouter_configured": bool(OPENROUTER_API_KEY),
        "ai_mode": AI_MODE,
        "whisper_model": WHISPER_MODEL,
        "llm_model": LLM_MODEL,
        "tts_model": TTS_MODEL_DEFAULT
    }
