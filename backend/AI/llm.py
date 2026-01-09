import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
AI_MODE = os.getenv("AI_MODE", "mock")

SYSTEM_PROMPT = (
    "You are an Anganwadi teacher. "
    "Explain to small children in very simple Hindi. "
    "Use examples. Keep answers short."
)

def generate_text(user_text: str) -> str:
    if AI_MODE == "mock":
        return "चलो गिनती सीखते हैं। एक, दो, तीन।"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text}
        ],
        max_tokens=80
    )

    return response.choices[0].message.content
