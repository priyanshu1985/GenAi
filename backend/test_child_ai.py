# Test the enhanced child-friendly AI system with gamification
import os
import sys

# Set environment mode to mock for testing
os.environ["AI_MODE"] = "mock"

# Add current directory to path
sys.path.append('.')

from AI.llm import generate_text, detect_learning_topic, generate_child_response_elements

def test_child_friendly_ai():
    """Test enhanced child-friendly AI with gamification"""
    
    test_cases = [
        {
            "input": "What are colors?",
            "expected_lang": "English",
            "expected_topic": "colors"
        },
        {
            "input": "kya hai animals mujhe sikhao",
            "expected_lang": "Hindi", 
            "expected_topic": "animals"
        },
        {
            "input": "teach me numbers please",
            "expected_lang": "English",
            "expected_topic": "numbers"
        },
        {
            "input": "namaste shapes sikhaiye",
            "expected_lang": "Hindi",
            "expected_topic": "shapes"
        }
    ]

    print("Testing Enhanced Child-Friendly AI with Gamification:")
    print("=" * 60)

    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['input']}")
        print(f"Expected Language: {test['expected_lang']}")
        print(f"Expected Topic: {test['expected_topic']}")
        print("-" * 40)
        
        # Test topic detection
        topic = detect_learning_topic(test['input'])
        print(f"Detected Topic: {topic}")
        
        # Test response elements generation  
        elements = generate_child_response_elements(test['input'], test['expected_lang'].lower(), topic)
        print(f"Response Elements: {elements}")
        
        # Test full AI response
        try:
            response = generate_text(test['input'])
            print(f"AI Response: {response}")
        except Exception as e:
            print(f"Error: {e}")
        
        print("=" * 60)

if __name__ == "__main__":
    test_child_friendly_ai()