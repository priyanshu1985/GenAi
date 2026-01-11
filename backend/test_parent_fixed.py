#!/usr/bin/env python3
"""Test parent-to-teacher messaging with corrected message types."""

import requests
import json

# API endpoint
url = "http://localhost:8000/api/messages/send"

# Test data
parent_id = "7bf19189-b879-46ac-8c77-f31f911a1811"
teacher_id = "199750f4-7b09-40cd-8863-009dc7d5f43c"

# Test valid message types
valid_types = ["general", "text"]

headers = {
    "Content-Type": "application/json",
    "X-User-ID": parent_id,
    "X-User-Role": "parent"
}

print("Testing parent-to-teacher messaging with corrected message types...")
print("=" * 70)

for msg_type in valid_types:
    data = {
        "receiver_id": teacher_id,
        "message": f"Test {msg_type} message from parent to teacher",
        "message_type": msg_type
    }
    
    print(f"\n🧪 Testing message type: {msg_type}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS! Message ID: {result.get('message_id')}")
            msg_data = result.get('data', {})
            print(f"   Direction: {msg_data.get('direction')}")
            print(f"   Message Type: {msg_data.get('message_type')}")
        else:
            print(f"❌ FAILED! Status: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ EXCEPTION! {str(e)}")

print(f"\n🎉 Parent dashboard should now work properly with these message types!")
print(f"✅ Valid parent message types: {valid_types}")