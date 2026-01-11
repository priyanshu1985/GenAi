#!/usr/bin/env python3
"""Final test of parent-to-teacher messaging with working message types."""

import requests
import json

# API endpoint
url = "http://localhost:8000/api/messages/send"

# Test data
parent_id = "7bf19189-b879-46ac-8c77-f31f911a1811"
teacher_id = "199750f4-7b09-40cd-8863-009dc7d5f43c"

# Test the problematic case that was failing before
data = {
    "receiver_id": teacher_id,
    "message": "why holiday??", 
    "message_type": "doubt"
}

headers = {
    "Content-Type": "application/json",
    "X-User-ID": parent_id,
    "X-User-Role": "parent"
}

print("Testing the exact failing case from ParentDashboard...")
print("=" * 60)
print(f"Parent ID: {parent_id}")
print(f"Teacher ID: {teacher_id}")
print(f"Message: {data['message']}")
print(f"Message Type: {data['message_type']}")
print("-" * 60)

try:
    response = requests.post(url, json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ SUCCESS! The parent dashboard should now work!")
        print(f"Message ID: {result.get('message_id')}")
        
        msg_data = result.get('data', {})
        print(f"\nMessage Details:")
        print(f"  Direction: {msg_data.get('direction')}")
        print(f"  Message Type: {msg_data.get('message_type')}")
        print(f"  Sender ID: {msg_data.get('sender_id')[:8]}...")
        print(f"  Receiver ID: {msg_data.get('receiver_id')[:8]}...")
        print(f"  Teacher ID: {msg_data.get('teacher_id')[:8]}...")
        print(f"  Parent ID: {msg_data.get('parent_id')[:8]}...")
        
    else:
        print(f"❌ FAILED! Status: {response.status_code}")
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"❌ EXCEPTION! {str(e)}")

print(f"\n🚀 Try the ParentDashboard now - it should work perfectly!")