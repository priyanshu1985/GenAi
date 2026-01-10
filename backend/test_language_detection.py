# Test language detection without emoji encoding issues
import os
import sys

# Set environment mode to mock for testing
os.environ["AI_MODE"] = "mock"

# Add current directory to path
sys.path.append('.')

from AI.llm import generate_text

def test_language_responses():
    """Test AI responses in different languages"""
    
    test_cases = [
        {
            "input": "What are colors?",
            "expected_lang": "English"
        },
        {
            "input": "kya hai colors mujhe sikhao",
            "expected_lang": "Hindi"
        },
        {
            "input": "teach me numbers please", 
            "expected_lang": "English"
        },
        {
            "input": "namaste main numbers seekhna chahta hun",
            "expected_lang": "Hindi"
        }
    ]

    print("Testing Language-Aware AI Responses:")
    print("=" * 50)

    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['input']}")
        print(f"Expected Language: {test['expected_lang']}")
        print("-" * 30)
        
        try:
            response = generate_text(test['input'])
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_language_responses()