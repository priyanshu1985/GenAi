"""
LLM Reasoning Module using OpenRouter API
Uses Mistral-7B-Instruct for generating personalized educational responses.
"""

import os
import requests
from typing import Optional
from dotenv import load_dotenv
from AI.profiles import get_profile_context, ChildProfile

load_dotenv()

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

# Model configuration
LLM_MODEL = "mistralai/mistral-7b-instruct"

# Mock mode for testing
AI_MODE = os.getenv("AI_MODE", "live")

# System prompt for the Anganwadi teacher persona
SYSTEM_PROMPT_TEMPLATE = """You are a friendly and caring Anganwadi teacher (a preschool teacher in India).

Your role:
- Help young children learn through fun and simple explanations
- Be warm, encouraging, and patient
- Use simple vocabulary appropriate for the child's age
- Keep responses SHORT (2-3 sentences maximum)
- Always be positive and celebrate small achievements
- Use examples from everyday life that children can relate to

{child_context}

IMPORTANT RULES:
1. Respond ONLY in the child's preferred language
2. Use VERY simple words suitable for a young child
3. Keep your response to 2-3 short sentences
4. Be encouraging and end with a positive note or gentle question
5. If teaching numbers, use fingers or familiar objects as examples
6. If teaching colors, relate to fruits, flowers, or toys
7. Never use complex or scary words
"""


def generate_text(
    user_text: str,
    child_id: Optional[str] = None,
    child_profile: Optional[ChildProfile] = None
) -> str:
    """
    Generate a personalized educational response using OpenRouter LLM.

    Args:
        user_text: The transcribed text from the child
        child_id: Optional child ID to load profile
        child_profile: Optional pre-loaded child profile

    Returns:
        Generated response text in the child's preferred language
    """
    if AI_MODE == "mock":
        return "वाह! बहुत अच्छा सवाल। चलो साथ में गिनती करें - एक, दो, तीन!"

    # Get child context for personalization
    if child_profile:
        child_context = get_profile_context(child_profile.child_id)
    elif child_id:
        child_context = get_profile_context(child_id)
    else:
        child_context = get_profile_context("unknown")

    # Build the system prompt with child context
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(child_context=child_context)

    try:
        # Prepare the request payload
        payload = {
            "model": LLM_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_text
                }
            ],
            "max_tokens": 150,  # Keep responses short
            "temperature": 0.7,  # Balanced creativity
            "top_p": 0.9
        }

        # Request headers
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://buildathon-learning-app.com",  # Your app URL
            "X-Title": "Buildathon Learning Assistant"  # App name for OpenRouter
        }

        # Make the API request
        response = requests.post(
            OPENROUTER_BASE_URL,
            json=payload,
            headers=headers,
            timeout=30
        )

        # Check for successful response
        response.raise_for_status()

        # Parse the response
        result = response.json()

        # Extract the generated text
        if "choices" in result and len(result["choices"]) > 0:
            generated_text = result["choices"][0]["message"]["content"]
            return generated_text.strip()
        else:
            print(f"Unexpected LLM response format: {result}")
            return get_fallback_response()

    except requests.exceptions.Timeout:
        print("LLM request timed out")
        return get_fallback_response()

    except requests.exceptions.RequestException as e:
        print(f"LLM API Error: {str(e)}")
        return get_fallback_response()

    except Exception as e:
        print(f"LLM Error: {str(e)}")
        return get_fallback_response()


def get_fallback_response(language: str = "hindi") -> str:
    """
    Return a friendly fallback response when LLM fails.

    Args:
        language: The preferred language for the response

    Returns:
        A simple encouraging message
    """
    fallback_responses = {
        "hindi": "बहुत अच्छा! चलो फिर से कोशिश करते हैं। तुम बहुत अच्छे हो!",
        "english": "Great try! Let's try again. You're doing wonderful!",
        "tamil": "மிகவும் நல்லது! மீண்டும் முயற்சிக்கலாம். நீ அருமை!",
        "telugu": "చాలా బాగుంది! మళ్ళీ ప్రయత్నిద్దాం. నువ్వు చాలా గొప్ప!",
        "kannada": "ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ! ಮತ್ತೆ ಪ್ರಯತ್ನಿಸೋಣ. ನೀನು ಅದ್ಭುತ!",
        "malayalam": "വളരെ നല്ലത്! വീണ്ടും ശ്രമിക്കാം. നീ മിടുക്കൻ!"
    }

    return fallback_responses.get(language, fallback_responses["hindi"])


def generate_topic_lesson(
    topic: str,
    child_id: Optional[str] = None,
    language: str = "hindi"
) -> str:
    """
    Generate a short lesson on a specific topic.

    Args:
        topic: The learning topic (e.g., "numbers", "colors", "shapes")
        child_id: Optional child ID for personalization
        language: Preferred language for the lesson

    Returns:
        A short, engaging lesson text
    """
    topic_prompts = {
        "numbers": f"Teach the child to count from 1 to 5 in {language} using fun examples.",
        "colors": f"Teach the child about basic colors (red, blue, yellow) in {language} with fun examples.",
        "shapes": f"Teach the child about circle, square, and triangle in {language} using everyday objects.",
        "animals": f"Tell the child about common animals and their sounds in {language}.",
        "fruits": f"Teach the child about common fruits in {language} with their colors.",
        "rhymes": f"Recite a simple nursery rhyme suitable for a young child in {language}."
    }

    prompt = topic_prompts.get(
        topic.lower(),
        f"Teach something fun and educational to a young child in {language}."
    )

    return generate_text(prompt, child_id=child_id)
