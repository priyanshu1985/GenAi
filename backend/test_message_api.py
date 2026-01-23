"""
Direct API test for message sending
This will help us identify the exact error
"""

import requests
import json

def test_send_message():
    url = "http://localhost:8000/api/messages/send"
    
    data = {
        "receiver_id": "7bf19189-b879-46ac-8c77-f31f911a1811",  # Real parent ID
        "message": "Test message from API test with real IDs",
        "message_type": "general"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-User-Id": "199750f4-7b09-40cd-8863-009dc7d5f43c",  # Real teacher ID
        "X-User-Role": "teacher"
    }
    
    print("🧪 Testing message send API...")
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, headers=headers, json=data)
        
        print(f"\n📊 Response Status: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"📝 Response Data: {json.dumps(response_data, indent=2)}")
        except:
            print(f"📝 Response Text: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_debug_endpoint():
    url = "http://localhost:8000/api/messages/debug"
    
    print("\n🔧 Testing debug endpoint...")
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Data: {response.json()}")
    except Exception as e:
        print(f"Debug test failed: {e}")

def test_schema_endpoint():
    url = "http://localhost:8000/api/messages/test-schema"
    
    print("\n🗃️ Testing schema endpoint...")
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Data: {response.json()}")
    except Exception as e:
        print(f"Schema test failed: {e}")

if __name__ == "__main__":
    test_debug_endpoint()
    test_schema_endpoint()
    test_send_message()