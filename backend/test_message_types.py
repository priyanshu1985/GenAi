#!/usr/bin/env python3
"""Test various message types to see which ones work with the database constraint."""

import requests
import json

# API endpoint
url = "http://localhost:8000/api/messages/send"

# Test data
parent_id = "7bf19189-b879-46ac-8c77-f31f911a1811"
teacher_id = "199750f4-7b09-40cd-8863-009dc7d5f43c"

# Test different message types
message_types_to_test = [
    "general",
    "text",
    "complaint", 
    "doubt",
    "feedback",
    "homework",
    "announcement"
]

headers = {
    "Content-Type": "application/json",
    "X-User-ID": parent_id,
    "X-User-Role": "parent"
}

print("Testing various message types to find database constraint limits...")
print("=" * 70)

working_types = []
failed_types = []

for msg_type in message_types_to_test:
    data = {
        "receiver_id": teacher_id,
        "message": f"Test message for type: {msg_type}",
        "message_type": msg_type
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            print(f"✅ {msg_type:<12} - SUCCESS")
            working_types.append(msg_type)
        else:
            print(f"❌ {msg_type:<12} - FAILED ({response.status_code})")
            failed_types.append(msg_type)
            if "check constraint" in response.text:
                print(f"   Database constraint violation")
            
    except Exception as e:
        print(f"❌ {msg_type:<12} - EXCEPTION: {str(e)}")
        failed_types.append(msg_type)

print("\n" + "=" * 70)
print(f"✅ Working types: {working_types}")
print(f"❌ Failed types: {failed_types}")
print(f"\nRecommendation: Use only the working types in the frontend.")