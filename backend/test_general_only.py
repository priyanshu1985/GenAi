#!/usr/bin/env python3
"""Test parent-to-teacher messaging with only 'general' type."""

import requests

# API endpoint
url = "http://localhost:8000/api/messages/send"

# Test data
parent_id = "7bf19189-b879-46ac-8c77-f31f911a1811"
teacher_id = "199750f4-7b09-40cd-8863-009dc7d5f43c"

# Test with only general type
data = {
    "receiver_id": teacher_id,
    "message": "why holiday?? - using general type",
    "message_type": "general"
}

headers = {
    "Content-Type": "application/json",
    "X-User-ID": parent_id,
    "X-User-Role": "parent"
}

print("Testing parent-to-teacher messaging with ONLY 'general' type...")
print("=" * 60)

try:
    response = requests.post(url, json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ SUCCESS! Parent dashboard should now work perfectly!")
        print(f"Message ID: {result.get('message_id')}")
        
    else:
        print(f"❌ FAILED! Status: {response.status_code}")
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"❌ EXCEPTION! {str(e)}")