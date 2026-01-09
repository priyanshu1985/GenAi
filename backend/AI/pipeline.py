from AI.stt import speech_to_text
from AI.llm import generate_text
from AI.tts import text_to_speech

def voice_to_voice(audio_bytes: bytes) -> dict:
    # Step 1: Voice → Text
    input_text = speech_to_text(audio_bytes)

    # Step 2: Text → Text (LLM)
    reply_text = generate_text(input_text)

    # Step 3: Text → Voice
    voice_output = text_to_speech(reply_text)

    return {
        "input_text": input_text,
        "reply_text": reply_text,
        "voice_output": voice_output
    }
