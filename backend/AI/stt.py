import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
AI_MODE = os.getenv("AI_MODE", "mock")

def speech_to_text(audio_bytes: bytes) -> str:
    if AI_MODE == "mock":
        return "बच्चा गिनती सीखना चाहता है"

    # REAL OpenAI Whisper
    with open("temp_audio.wav", "wb") as f:
        f.write(audio_bytes)

    with open("temp_audio.wav", "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1"
        )

    return transcript.text
