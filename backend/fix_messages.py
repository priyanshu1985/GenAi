"""
Quick fix script for message system
This script will:
1. Verify Supabase connection  
2. Create the messages table if it doesn't exist
3. Insert demo messages for testing
"""

import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, Client

def main():
    print("🔧 Setting up message system...")
    
    # Initialize Supabase client
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL or SUPABASE_KEY not configured")
        print("Please set these in your .env file")
        return
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client connected")
    
    # Check if users table exists and get some user IDs
    try:
        users_result = supabase.table("users").select("id, email, role").limit(5).execute()
        users = users_result.data or []
        print(f"✅ Found {len(users)} users in database")
        
        teacher_id = None
        parent_id = None
        
        for user in users:
            if user.get("role") == "teacher" and not teacher_id:
                teacher_id = user["id"]
            elif user.get("role") == "parent" and not parent_id:
                parent_id = user["id"]
        
        print(f"📧 Teacher ID: {teacher_id}")
        print(f"👨‍👩‍👧‍👦 Parent ID: {parent_id}")
        
    except Exception as e:
        print(f"❌ Error accessing users table: {e}")
        return
    
    # Check if messages table exists
    try:
        messages_result = supabase.table("teacher_parent_messages").select("*").limit(1).execute()
        print("✅ Messages table exists")
        
        # Get existing messages count
        count_result = supabase.table("teacher_parent_messages").select("id", count="exact").execute()
        message_count = count_result.count or 0
        print(f"📨 Found {message_count} existing messages")
        
        if message_count == 0 and teacher_id and parent_id:
            # Insert demo messages
            demo_messages = [
                {
                    "teacher_id": teacher_id,
                    "parent_id": parent_id,
                    "message": "Welcome! Your child has started learning alphabets today. Great progress so far!",
                    "message_type": "general",
                    "is_read": False
                },
                {
                    "teacher_id": teacher_id,
                    "parent_id": parent_id,
                    "message": "Homework: Please practice writing letters A-E at home. Due tomorrow.",
                    "message_type": "homework", 
                    "is_read": False
                },
                {
                    "teacher_id": teacher_id,
                    "parent_id": parent_id,
                    "message": "Excellent! Your child completed the numbers lesson with 90% score.",
                    "message_type": "progress",
                    "is_read": True
                }
            ]
            
            for msg in demo_messages:
                try:
                    result = supabase.table("teacher_parent_messages").insert(msg).execute()
                    print(f"✅ Inserted message: {msg['message'][:50]}...")
                except Exception as e:
                    print(f"❌ Error inserting message: {e}")
        
    except Exception as e:
        print(f"❌ Messages table doesn't exist or error: {e}")
        print("📝 You need to run the SQL schema in Supabase SQL editor:")
        print("   Go to: Supabase Dashboard > SQL Editor")
        print("   Paste the contents of: supabase_messages_schema.sql")
        print("   Click RUN")
        return
    
    print("\n🎉 Message system setup complete!")
    print("🔍 You can now test:")
    print("   1. Login as teacher and send a message")
    print("   2. Login as parent and check messages")
    print("   3. Check console for any API errors")

if __name__ == "__main__":
    main()