"""
LLM Reasoning Module using OpenRouter API
Uses Mistral-7B-Instruct for generating personalized educational responses.
"""

import os
import requests
import re
from typing import Optional
from dotenv import load_dotenv
from AI.profiles import get_profile_context, ChildProfile

load_dotenv()

# Language detection patterns
LANGUAGE_PATTERNS = {
    "hindi": r'[\u0900-\u097F]',  # Devanagari script
    "marathi": r'[\u0900-\u097F]',  # Devanagari script (same as Hindi)
    "tamil": r'[\u0B80-\u0BFF]',  # Tamil script
    "telugu": r'[\u0C00-\u0C7F]', # Telugu script
    "kannada": r'[\u0C80-\u0CFF]', # Kannada script
    "malayalam": r'[\u0D00-\u0D7F]', # Malayalam script
    "english": r'^[a-zA-Z\s\d\.,\?!]+$'  # Only English chars
}

# Common words for better detection
LANGUAGE_KEYWORDS = {
    "hindi": ["क्या", "कैसे", "कहाँ", "कब", "कौन", "मैं", "आप", "है", "हैं", "का", "की", "के",
              "kya", "kaise", "kahan", "kab", "kaun", "main", "mujhe", "aap", "hai", "hain", 
              "ka", "ki", "ke", "sikhao", "batao", "namaste", "accha", "theek", "samjha",
              "kitna", "kitni", "time", "lagega", "naam", "tumhara", "mera", "ye", "wo", "ji"],
    "marathi": ["काय", "कसे", "कुठे", "केव्हा", "कोण", "मी", "तू", "आहे", "आहेत", "च्या", "ची", "चे",
               "kay", "kase", "kuthe", "kevha", "kon", "mi", "tu", "tujhe", "maze", "ahe", "ahet",
               "cha", "chi", "che", "shikvun", "sang", "namaskar", "chaan", "thik", "samajle",
               "kitna", "kitni", "vela", "naav", "tuze", "maze", "he", "te", "hoy"],
    "english": ["what", "how", "where", "when", "who", "i", "you", "is", "are", "the", "a", "an",
                "me", "my", "your", "this", "that", "tell", "teach", "learn", "good", "nice"],
    "tamil": ["என்ன", "எப்படி", "எங்கே", "எப்போது", "யார்", "நான்", "நீ", "இருக்கு", "உள்ள"],
    "telugu": ["ఏమి", "ఎలా", "ఎక్కడ", "ఎప్పుడు", "ఎవరు", "నేను", "మీరు", "ఉంది", "ఉన్న"],
    "kannada": ["ಏನು", "ಹೇಗೆ", "ಎಲ್ಲಿ", "ಯಾವಾಗ", "ಯಾರು", "ನಾನು", "ನೀವು", "ಇದೆ", "ಇರುವ"],
    "malayalam": ["എന്ത്", "എങ്ങനെ", "എവിടെ", "എപ്പോൾ", "ആര്", "ഞാൻ", "നിങ്ങൾ", "ഉണ്ട്", "ഉള്ള"]
}

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

# Model configuration - using a more reliable model
LLM_MODEL = "meta-llama/llama-3.2-3b-instruct"

# Gamification Elements for Children (Age 2-6)
CHILD_BADGES = {
    "colors": {"emoji": "🎨", "name": "Color Expert", "hindi": "रंग एक्सपर्ट", "telugu": "రంగుల నిపుణుడు", "marathi": "रंग तज्ञ"},
    "numbers": {"emoji": "🔢", "name": "Number Champion", "hindi": "नंबर चैंपियन", "telugu": "సంఖ్యల విజేత", "marathi": "नंबर चॅम्पियन"},
    "animals": {"emoji": "🐘", "name": "Animal Friend", "hindi": "जानवरों का दोस्त", "telugu": "జంతువుల మిత్రుడు", "marathi": "प्राण्यांचा मित्र"},
    "alphabets": {"emoji": "📚", "name": "ABC Star", "hindi": "ABC स्टार", "telugu": "ABC స్టార్", "marathi": "ABC स्टार"},
    "shapes": {"emoji": "🔷", "name": "Shape Master", "hindi": "शेप मास्टर", "telugu": "ఆకారాల మేధావి", "marathi": "आकार मास्टर"},
    "fruits": {"emoji": "🍎", "name": "Fruit Lover", "hindi": "फल प्रेमी", "telugu": "పండ్ల ప్రేమికుడు", "marathi": "फळांचा प्रेमी"}
}

CHILD_PRAISE_WORDS = {
    "english": ["Great job!", "Awesome!", "You're amazing!", "Super!", "Fantastic!", "Well done!"],
    "hindi": ["वाह!", "बहुत अच्छा!", "शाबाश!", "सुपर!", "कमाल!", "बहुत बढ़िया!"],
    "telugu": ["వాహ్!", "చాలా బాగుంది!", "అద్భుతం!", "సూపర్!", "అవును!", "చాలా మంచి!"],
    "marathi": ["वाह!", "खूप चांगले!", "शाब्बास!", "सुपर!", "छान!", "अप्रतिम!"]
}

FUN_ACTIONS = {
    "english": ["Clap clap!", "Jump jump!", "Dance dance!", "Hip hip hooray!", "High five!"],
    "hindi": ["ताली बजाओ!", "कूदो कूदो!", "नाचो नाचो!", "वाह वाह!", "हाई फाइव!"],
    "telugu": ["చప్పట్లు కొట్టు!", "గంతులు వేయి!", "డాన్స్ చేయి!", "వాహ్ వాహ్!", "హై ఫైవ్!"],
    "marathi": ["टाळी वाजवा!", "उडी मारा!", "नाचा नाचा!", "वाह वाह!", "हाय फाइव्ह!"]
}

# Mock mode for testing
AI_MODE = os.getenv("AI_MODE", "live")

# System prompt for the Anganwadi teacher persona with gamification
SYSTEM_PROMPT_TEMPLATE = """You are a fun, loving Anganwadi teacher for children aged 2-6 years. You make learning exciting with rewards, stars, and badges!

{child_context}
{streak_info}
{badge_info}

CRITICAL: Respond ONLY in {response_language} language. Match the child's question language exactly.

Gamification Rules:
- Always give stars (⭐) for good questions: "⭐ Great question!"
- Use simple words that 2-6 year olds understand
- Add clapping and cheering: "Waah! Shabash!" or "Yay! Good job!"
- Give learning badges: "🏆 Number Champion!" "🎨 Color Expert!"
- Use fun sounds: "Clap clap!", "Hip hip hooray!"
- Keep responses very short (1 sentence)
- Use repetition for learning: "Red red tomato, blue blue sky!"
- Add interactive elements: "Let's count together!", "Say after me!"

Child-Friendly Examples:
For English: "⭐ A for Apple! 🍎 You're learning so well! Clap clap! 🏆"
For Hindi: "⭐ अ आम का! 🥭 वाह! तुम बहुत अच्छे हो! ताली बजाओ! 🏆"
For Telugu: "⭐ అ ఆపిల్ అని! 🍎 వాహ్! నువ్వు చాలా మంచివాడివి! చప్పట్లు కొట్టు! 🏆"

Always include: Praise + Learning + Fun Action + Badge/Star

Respond with excitement and love in the SAME language as the question!"""


def detect_language(text: str) -> str:
    """
    Detect the language of input text.
    
    Args:
        text: Input text to analyze
        
    Returns:
        Detected language code
    """
    if not text or not text.strip():
        return "hindi"  # Default fallback
    
    text_lower = text.lower()
    
    # First check for common keywords (better for romanized text)
    keyword_scores = {}
    for lang, keywords in LANGUAGE_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text_lower:
                score += 1
        if score > 0:
            keyword_scores[lang] = score
    
    # If we found keywords, use the language with highest score
    if keyword_scores:
        detected_lang = max(keyword_scores.items(), key=lambda x: x[1])[0]
        print(f"Keyword detection: {keyword_scores} -> {detected_lang}")
        return detected_lang
    
    # Then check for script patterns
    for lang, pattern in LANGUAGE_PATTERNS.items():
        if re.search(pattern, text):
            if lang == "english":
                # For English, also check it's not mixed with other scripts
                if not any(re.search(LANGUAGE_PATTERNS[other], text) 
                          for other in LANGUAGE_PATTERNS if other != "english"):
                    return "english"
            else:
                return lang
    
    # Default fallback
    return "hindi"


def detect_learning_topic(text: str) -> str:
    """
    Detect what the child is trying to learn about.
    
    Args:
        text: Child's input text
        
    Returns:
        Learning topic category
    """
    text_lower = text.lower()
    
    topic_keywords = {
        "colors": ["color", "rang", "red", "blue", "green", "yellow", "laal", "neela", "hara", "peela", "रंग", "లాల్", "నీలం"],
        "numbers": ["number", "count", "ginati", "1", "2", "3", "one", "two", "three", "ek", "do", "teen", "गिनती", "సంఖ్య"],
        "animals": ["animal", "janwar", "elephant", "tiger", "dog", "cat", "hathi", "sher", "kutta", "billi", "जानवर", "జంతువు"],
        "alphabets": ["alphabet", "abc", "letter", "akshar", "अक्षर", "అక్షరం", "a", "b", "c"],
        "shapes": ["shape", "aakar", "circle", "square", "triangle", "gol", "चौकोर", "త్రిభుజం"],
        "fruits": ["fruit", "phal", "apple", "banana", "mango", "seb", "kela", "aam", "फल", "పండు"]
    }
    
    for topic, keywords in topic_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                return topic
    
    return "general"


def generate_child_response_elements(text: str, detected_lang: str, topic: str):
    """
    Generate gamified response elements for children.
    
    Args:
        text: Child's input
        detected_lang: Detected language 
        topic: Learning topic
        
    Returns:
        Dict with praise, badge, and fun action
    """
    import random
    
    # Get random praise word
    praise = random.choice(CHILD_PRAISE_WORDS.get(detected_lang, CHILD_PRAISE_WORDS["english"]))
    
    # Get appropriate badge for topic
    badge = CHILD_BADGES.get(topic, CHILD_BADGES["alphabets"])
    badge_text = f"{badge['emoji']} {badge.get(detected_lang, badge['name'])}"
    
    # Get fun action
    action = random.choice(FUN_ACTIONS.get(detected_lang, FUN_ACTIONS["english"]))
    
    return {
        "praise": praise,
        "badge": badge_text,
        "action": action,
        "stars": "⭐" * random.randint(2, 5)
    }


def get_child_context(child_profile: dict = None) -> str:
    """
    Generate child-specific context with learning progress.
    
    Args:
        child_profile: Child's profile information
        
    Returns:
        Formatted context string
    """
    if child_profile:
        name = child_profile.get('name', 'bachche')
        age = child_profile.get('age', '4')
        streak = child_profile.get('learning_streak', 1)
        
        return f"You are teaching {name} (age {age}). Learning streak: {streak} days! Keep encouraging!"
    else:
        return "You are teaching a bright young child at Anganwadi. Make it fun and exciting!"


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
        Generated response text in the same language as the input
    """
    print(f"🧠 LLM: Starting text generation for input: '{user_text}'")
    print(f"👦 LLM: Child ID: {child_id}")
    
    # Detect input language first
    detected_lang = detect_language(user_text)
    print(f"🔍 LLM: Detected input language: {detected_lang}")
        # Detect learning topic for appropriate badge
    topic = detect_learning_topic(user_text)
    print(f"LLM: Detected learning topic: {topic}")
    
    # Generate gamification elements
    response_elements = generate_child_response_elements(user_text, detected_lang, topic)
    print(f"LLM: Generated response elements: {response_elements}")
        # Language mapping for response
    language_map = {
        "english": "English",
        "hindi": "Hindi", 
        "telugu": "Telugu",
        "tamil": "Tamil",
        "kannada": "Kannada",
        "malayalam": "Malayalam"
    }
    
    response_language = language_map.get(detected_lang, "Hindi")
    print(f"📝 LLM: Response will be in: {response_language}")
    
    if AI_MODE == "mock":
        # Return child-friendly mock response with gamification
        elements = response_elements
        
        mock_responses = {
            "hindi": f"{elements['stars']} {elements['praise']} बहुत अच्छा सवाल! चलो साथ में सीखें! {elements['action']} {elements['badge']}",
            "english": f"{elements['stars']} {elements['praise']} Great question, little star! Let's learn together! {elements['action']} {elements['badge']}",
            "telugu": f"{elements['stars']} {elements['praise']} చాలా మంచి ప్రశ్న, చిన్న స్టార్! కలిసి నేర్చుకుందాం! {elements['action']} {elements['badge']}",
            "tamil": f"{elements['stars']} {elements['praise']} மிகவும் நல்ல கேள்வி, சிறிய நட்சத்திரம்! கூட கற்போம்! {elements['action']} {elements['badge']}",
            "kannada": f"{elements['stars']} {elements['praise']} ತುಂಬಾ ಒಳ್ಳೆಯ ಪ್ರಶ್ನೆ, ಚಿಕ್ಕ ಸ್ಟಾರ್! ಒಟ್ಟಿಗೆ ಕಲಿಯೋಣ! {elements['action']} {elements['badge']}",
            "malayalam": f"{elements['stars']} {elements['praise']} വളരെ നല്ല ചോദ്യം, ചെറിയ നക്ഷത്രം! കൂടെ പഠിക്കാം! {elements['action']} {elements['badge']}"
        }
        return mock_responses.get(detected_lang, mock_responses["hindi"])

    # Check API key
    if not OPENROUTER_API_KEY:
        print("❌ LLM ERROR: No OpenRouter API key found")
        return get_fallback_response(detected_lang, topic)
    
    print(f"🔑 LLM: API Key present: {OPENROUTER_API_KEY[:10]}...{OPENROUTER_API_KEY[-5:]}")

    # Get enhanced child context with gamification
    if child_profile:
        child_context = get_child_context(child_profile.__dict__ if hasattr(child_profile, '__dict__') else {})
        streak_info = f"Learning Streak: {getattr(child_profile, 'learning_streak', 1)} days! Keep it up!"
    elif child_id:
        child_context = get_child_context({"child_id": child_id})
        streak_info = "New learner! Let's start the learning adventure!"
    else:
        child_context = get_child_context()
        streak_info = "Every question is a step towards learning!"

    # Badge information based on detected topic
    badge_info = f"Today's focus: {topic.title()} learning! {CHILD_BADGES.get(topic, CHILD_BADGES['alphabets'])['emoji']}"
    
    print(f"LLM: Child context: {child_context[:100]}...")
    print(f"LLM: Streak info: {streak_info}")
    print(f"LLM: Badge info: {badge_info}")

    # Build the system prompt with enhanced child context and gamification
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        child_context=child_context,
        streak_info=streak_info,
        badge_info=badge_info,
        response_language=response_language
    )

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
            "max_tokens": 100,  # Keep responses shorter
            "temperature": 0.3,  # More focused responses
            "top_p": 0.9,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
            "stop": ["<s>", "</s>", "<|endoftext|>", "\n\n"]  # Stop unwanted tokens
        }

        print(f"🚀 LLM: Making API request to {OPENROUTER_BASE_URL}")
        print(f"🤖 LLM: Using model: {LLM_MODEL}")

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

        print(f"📡 LLM: Response status: {response.status_code}")
        
        # Check for successful response
        response.raise_for_status()

        # Parse the response
        result = response.json()
        print(f"📋 LLM: Raw response: {result}")

        # Extract the generated text
        if "choices" in result and len(result["choices"]) > 0:
            generated_text = result["choices"][0]["message"]["content"]
            
            # Clean up unwanted tokens and formatting
            generated_text = generated_text.replace("<s>", "").replace("</s>", "")
            generated_text = generated_text.replace("<|endoftext|>", "")
            generated_text = generated_text.replace("\\n", " ")
            generated_text = generated_text.strip()
            
            # If response is too short or weird, use fallback
            if len(generated_text) < 5 or generated_text.startswith(("<", "[")):
                print(f"⚠️ LLM: Generated text seems invalid: '{generated_text}', using fallback")
                return get_fallback_response(detected_lang, topic)
            
            print(f"✅ LLM: Generated text: '{generated_text}'")
            return generated_text
        else:
            print(f"⚠️ LLM: Unexpected response format: {result}")
            return get_fallback_response(detected_lang, topic)

    except requests.exceptions.Timeout:
        print("⏰ LLM: Request timed out")
        return get_fallback_response(detected_lang, topic)

    except requests.exceptions.RequestException as e:
        print(f"❌ LLM: API Error - Status: {getattr(e.response, 'status_code', 'Unknown')}")
        print(f"❌ LLM: Error details: {str(e)}")
        if hasattr(e, 'response') and e.response:
            try:
                error_data = e.response.json()
                print(f"❌ LLM: Error response: {error_data}")
            except:
                print(f"❌ LLM: Error response text: {e.response.text}")
        return get_fallback_response(detected_lang, topic)

    except Exception as e:
        print(f"💥 LLM: Unexpected error: {str(e)}")
        return get_fallback_response(detected_lang, topic)


def get_fallback_response(language: str = "hindi", topic: str = "general") -> str:
    """
    Return a friendly gamified fallback response when LLM fails.

    Args:
        language: The preferred language for the response
        topic: The learning topic detected

    Returns:
        A child-friendly encouraging message with gamification
    """
    import random
    
    # Generate response elements for fallback
    elements = generate_child_response_elements("", language, topic)
    
    fallback_responses = {
        "hindi": f"{elements['stars']} {elements['praise']} तुम बहुत अच्छे हो! चलो साथ सीखें! {elements['action']} {elements['badge']}",
        "english": f"{elements['stars']} {elements['praise']} You're amazing, little star! Let's learn together! {elements['action']} {elements['badge']}",
        "tamil": f"{elements['stars']} {elements['praise']} நீ அருமை, சிறிய நட்சத்திரம்! கூட கற்போம்! {elements['action']} {elements['badge']}",
        "telugu": f"{elements['stars']} {elements['praise']} నువ్వు అద్భుతం, చిన్న స్టార్! కలిసి నేర్చుకుందాం! {elements['action']} {elements['badge']}",
        "kannada": f"{elements['stars']} {elements['praise']} ನೀನು ಅದ್ಭುತ, ಚಿಕ್ಕ ಸ್ಟಾರ್! ಸೇರಿ ಕಲಿಯೋಣ! {elements['action']} {elements['badge']}",
        "malayalam": f"{elements['stars']} {elements['praise']} നീ അതിശയകരം, ചെറിയ നക്ഷത്രം! കൂടെ പഠിക്കാം! {elements['action']} {elements['badge']}"
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
