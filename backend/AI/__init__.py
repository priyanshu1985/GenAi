"""
AI Module
Voice-first, multilingual, personalized learning assistant for children.

Components:
- stt.py: Speech-to-Text using Hugging Face Whisper
- llm.py: LLM Reasoning using OpenRouter (Mistral-7B)
- tts.py: Text-to-Speech using Hugging Face MMS-TTS
- profiles.py: Child profile management and personalization
- pipeline.py: Complete STT → LLM → TTS orchestration
"""

from AI.stt import speech_to_text
from AI.llm import generate_text
from AI.tts import text_to_speech
from AI.pipeline import voice_to_voice, interact
from AI.profiles import get_child_profile, ChildProfile

__all__ = [
    "speech_to_text",
    "generate_text",
    "text_to_speech",
    "voice_to_voice",
    "interact",
    "get_child_profile",
    "ChildProfile"
]
