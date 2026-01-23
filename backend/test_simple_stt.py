"""
Simple test script to check Hugging Face STT API connectivity
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")

print(f"🔑 Testing with API key: {HF_API_KEY[:10]}...{HF_API_KEY[-5:]}")

# Test if we can access the API at all
try:
    # Try to get model info first
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    
    # Test different endpoints
    models_to_test = [
        "openai/whisper-tiny",
        "facebook/wav2vec2-base-960h",
        "microsoft/speecht5_asr"
    ]
    
    for model in models_to_test:
        try:
            print(f"\n🧪 Testing model: {model}")
            
            # Check if model is accessible
            model_url = f"https://api-inference.huggingface.co/models/{model}"
            
            # Test with a minimal request first
            response = requests.get(model_url, headers=headers, timeout=10)
            print(f"📡 Model info status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ Model {model} is accessible")
                
                # Try a simple audio transcription test
                # Create minimal audio data (silence)
                audio_data = b'\x00' * 1000  # Simple silence
                
                response = requests.post(
                    model_url,
                    headers=headers,
                    data=audio_data,
                    timeout=30
                )
                
                print(f"📡 Transcription status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Transcription successful: {result}")
                    break
                elif response.status_code == 503:
                    print("⏳ Model is loading...")
                else:
                    print(f"❌ Transcription failed: {response.text[:200]}")
                    
            else:
                print(f"❌ Model not accessible: {response.text[:200]}")
                
        except Exception as e:
            print(f"❌ Error testing {model}: {e}")
    
except Exception as e:
    print(f"❌ General error: {e}")

print("\n🏁 Test completed")