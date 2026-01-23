# Language utilities for backend request handling
import os
from typing import Optional
from fastapi import Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Security scheme for authorization
security = HTTPBearer(auto_error=False)

def get_language_from_request(request: Request) -> str:
    """
    Extract language preference from request headers.
    
    Priority:
    1. Accept-Language header (from frontend)
    2. User profile language (from database)
    3. Default to Hindi
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Language code (hi, en, te, mr)
    """
    # Try to get language from Accept-Language header
    accept_language = request.headers.get('Accept-Language', '').lower().strip()
    
    # Map common language codes to our supported languages
    language_mapping = {
        'hi': 'hi',        # Hindi
        'hindi': 'hi',
        'en': 'en',        # English
        'english': 'en',
        'en-us': 'en',
        'en-gb': 'en',
        'te': 'te',        # Telugu
        'telugu': 'te',
        'te-in': 'te',
        'mr': 'mr',        # Marathi
        'marathi': 'mr',
        'mr-in': 'mr'
    }
    
    # Check if language is supported
    if accept_language in language_mapping:
        detected_language = language_mapping[accept_language]
        print(f"🌐 Language from Accept-Language header: {detected_language}")
        return detected_language
    
    # Try to extract language code from complex Accept-Language strings
    # Example: "en-US,en;q=0.9,hi;q=0.8"
    if ',' in accept_language:
        primary_lang = accept_language.split(',')[0].strip()
        if primary_lang in language_mapping:
            detected_language = language_mapping[primary_lang]
            print(f"🌐 Language from primary Accept-Language: {detected_language}")
            return detected_language
    
    # Default fallback to Hindi for Anganwadi context
    print("🌐 Using default language: Hindi")
    return 'hi'


def get_user_language_preference(user_id: str) -> str:
    """
    Get user's saved language preference from database.
    This will be integrated with Supabase user profile.
    
    Args:
        user_id: User identifier
        
    Returns:
        User's preferred language code
    """
    # TODO: Implement Supabase integration
    # For now, return Hindi as default
    return 'hi'


def create_language_aware_prompt(base_prompt: str, language: str, context: str = "") -> str:
    """
    Create a language-specific prompt for AI/LLM requests.
    
    Args:
        base_prompt: The base prompt content
        language: Target language code
        context: Additional context for the prompt
        
    Returns:
        Enhanced prompt with language instructions
    """
    # Language-specific instruction templates
    language_instructions = {
        'hi': "बिल्कुल हिंदी भाषा में जवाब दें। छोटे बच्चों के लिए सरल शब्दों का उपयोग करें।",
        'en': "Reply ONLY in English language. Use very simple words suitable for small children aged 2-6.",
        'te': "పూర్తిగా తెలుగు భాషలో జవాబు ఇవ్వండి. 2-6 సంవత్సరాల చిన్న పిల్లలకు అనువైన సులభమైన పదాలను వాడండి।"
    }
    
    language_instruction = language_instructions.get(language, language_instructions['hi'])
    
    enhanced_prompt = f"""
{language_instruction}

{context}

User Query: {base_prompt}

Remember: 
- Respond ONLY in {language.upper()} language
- Use simple, child-friendly words
- Keep responses short and engaging
- Add learning elements appropriate for Anganwadi children
"""
    
    return enhanced_prompt


class LanguageMiddleware:
    """
    Middleware to handle language detection and processing for all requests.
    """
    
    @staticmethod
    def get_request_language(request: Request, user_id: Optional[str] = None) -> str:
        """
        Get the appropriate language for the current request.
        
        Args:
            request: FastAPI Request object
            user_id: Optional user ID for personalized language preference
            
        Returns:
            Language code to use for response
        """
        # First, try to get language from request headers
        header_language = get_language_from_request(request)
        
        # If user is authenticated, we could override with their preference
        if user_id:
            user_language = get_user_language_preference(user_id)
            if user_language:
                print(f"🌐 Using user's preferred language: {user_language}")
                return user_language
        
        return header_language
    
    @staticmethod
    def log_language_info(request: Request, language: str, endpoint: str):
        """
        Log language information for debugging and analytics.
        
        Args:
            request: FastAPI Request object
            language: Detected language
            endpoint: API endpoint being accessed
        """
        user_agent = request.headers.get('User-Agent', 'Unknown')
        accept_language = request.headers.get('Accept-Language', 'Not provided')
        
        print(f"""
🌐 Language Processing Info:
   Endpoint: {endpoint}
   Detected Language: {language}
   Accept-Language Header: {accept_language}
   User-Agent: {user_agent[:50]}...
   """)


# Dependency function for FastAPI routes
def get_request_language_dependency(request: Request) -> str:
    """
    FastAPI dependency to extract language from request.
    Usage: language: str = Depends(get_request_language_dependency)
    """
    return LanguageMiddleware.get_request_language(request)