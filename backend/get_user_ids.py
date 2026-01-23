"""
Get real user IDs from the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client

def get_real_user_ids():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Supabase not configured")
        return
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Get all users with their roles
        response = supabase.table("users").select("id, email, role, name").execute()
        
        users = response.data or []
        print(f"📊 Found {len(users)} users:")
        
        teacher_ids = []
        parent_ids = []
        
        for user in users:
            print(f"  - {user['email']} ({user.get('name', 'No name')}) - Role: {user['role']} - ID: {user['id']}")
            
            if user['role'] == 'teacher':
                teacher_ids.append(user['id'])
            elif user['role'] == 'parent':
                parent_ids.append(user['id'])
        
        print(f"\n📧 Teachers: {len(teacher_ids)}")
        for tid in teacher_ids:
            print(f"  - {tid}")
            
        print(f"\n👨‍👩‍👧‍👦 Parents: {len(parent_ids)}")
        for pid in parent_ids:
            print(f"  - {pid}")
            
        # Try to send a message with real IDs
        if teacher_ids and parent_ids:
            print(f"\n🧪 Testing with real IDs:")
            print(f"Teacher ID: {teacher_ids[0]}")
            print(f"Parent ID: {parent_ids[0]}")
            
            # Test message insertion
            data = {
                "sender_id": teacher_ids[0],
                "receiver_id": parent_ids[0],
                "direction": "teacher_to_parent",
                "message": "Test message with real UUIDs",
                "message_type": "general",
                "is_read": False
            }
            
            result = supabase.table("teacher_parent_messages").insert(data).execute()
            
            if result.data:
                print(f"✅ Message sent successfully: {result.data[0]['id']}")
            else:
                print(f"❌ Failed to send message")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    get_real_user_ids()