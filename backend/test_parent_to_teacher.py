#!/usr/bin/env python3
"""Test parent-to-teacher messaging specifically."""

import requests
import json

# API endpoint
url = "http://localhost:8000/api/messages/send"

# Test data - using the real UUIDs discovered earlier
parent_id = "7bf19189-b879-46ac-8c77-f31f911a1811"  # Real parent UUID
teacher_id = "199750f4-7b09-40cd-8863-009dc7d5f43c"  # Real teacher UUID

# Test parent-to-teacher message
data = {
    "receiver_id": teacher_id,
    "message": "Hello teacher, this is a test message from parent",
    "message_type": "text"
}

headers = {
    "Content-Type": "application/json",
    "X-User-ID": parent_id,
    "X-User-Role": "parent"
}

print("Testing parent-to-teacher messaging...")
print(f"Parent ID (sender): {parent_id}")
print(f"Teacher ID (receiver): {teacher_id}")
print(f"Headers: {headers}")
print(f"Data: {data}")
print("-" * 50)

try:
    response = requests.post(url, json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ SUCCESS! Parent-to-teacher message sent successfully!")
        print(f"Message ID: {result.get('message_id')}")
    else:
        print(f"\n❌ FAILED! Error: {response.status_code}")
        if response.text:
            print(f"Error details: {response.text}")
            
except Exception as e:
    print(f"\n❌ Exception occurred: {str(e)}")