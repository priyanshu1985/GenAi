def text_to_speech(text: str) -> dict:
    """
    Hackathon approach:
    - Frontend browser TTS OR
    - Dummy audio URL for demo
    """
    return {
        "tts_type": "browser",
        "text": text
    }
