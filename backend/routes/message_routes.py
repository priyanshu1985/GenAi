"""
Message Routes - Two-Way Teacher-Parent Communication
Teacher -> Parent: Updates, Homework, Progress, Announcements
Parent -> Teacher: Complaints, Doubts, Questions, Feedback
"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from supabase import create_client, Client
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY

router = APIRouter(tags=["Messages"])

# Initialize Supabase client
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# ============================================================
# Pydantic Models
# ============================================================

class SendMessageRequest(BaseModel):
    """Request model for sending a message"""
    receiver_id: Optional[str] = None  # New format: UUID of the receiver (parent or teacher)
    parent_id: Optional[str] = None    # Old format: For backward compatibility
    message: str
    message_type: str = "general"
    child_id: Optional[str] = None
    
    def get_receiver_id(self) -> str:
        """Get receiver ID from either new or old format"""
        return self.receiver_id or self.parent_id


class MarkReadRequest(BaseModel):
    """Request model for marking messages as read"""
    message_ids: List[int]


# ============================================================
# Message Types by Role
# ============================================================

TEACHER_MESSAGE_TYPES = ["general", "homework", "announcement"]
PARENT_MESSAGE_TYPES = ["general"]  # Only guaranteed working type


# ============================================================
# Helper Functions
# ============================================================

def get_user_id_from_header(user_id: Optional[str]) -> str:
    """Get user ID from header (simplified auth for demo)"""
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID required in header")
    return user_id


# ============================================================
# Test endpoint to check table schema
# ============================================================

@router.get("/messages/test-schema")
async def test_schema():
    """Test endpoint to check which table schema is available"""
    if not supabase:
        return {"error": "Database not available"}
    
    try:
        # Test new schema
        result = supabase.table("teacher_parent_messages").select("sender_id, receiver_id, direction").limit(1).execute()
        return {
            "schema": "new",
            "message": "New schema with sender_id, receiver_id, direction is available",
            "has_data": len(result.data or []) > 0
        }
    except Exception as e:
        try:
            # Test old schema
            old_result = supabase.table("teacher_parent_messages").select("teacher_id, parent_id").limit(1).execute()
            return {
                "schema": "old", 
                "message": "Old schema with teacher_id, parent_id is available",
                "error": str(e),
                "has_data": len(old_result.data or []) > 0
            }
        except Exception as old_e:
            return {
                "schema": "unknown",
                "message": "Could not determine table schema",
                "new_schema_error": str(e),
                "old_schema_error": str(old_e)
            }


# ============================================================
# API Endpoints
# ============================================================

@router.get("/messages/debug")
async def debug_messages():
    """Debug endpoint to test basic functionality"""
    try:
        if not supabase:
            return {"error": "Supabase not configured"}
        
        # Test basic connection
        result = supabase.table("users").select("id").limit(1).execute()
        
        return {
            "status": "success",
            "supabase_connected": True,
            "users_table_accessible": len(result.data or []) >= 0,
            "test_time": "2026-01-11"
        }
    except Exception as e:
        return {
            "status": "error", 
            "error": str(e),
            "supabase_connected": supabase is not None
        }


@router.post("/messages/send")
async def send_message(
    request: SendMessageRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    x_user_role: Optional[str] = Header(None, alias="X-User-Role")
):
    """
    Send a message (works for both teacher and parent).

    Headers:
        X-User-Id: Sender's user ID
        X-User-Role: Sender's role (teacher/parent)

    Body:
        receiver_id: UUID of the receiver
        message: Message content
        message_type: Type of message
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    print(f"🔍 Send message request: {request.dict()}")
    print(f"🔍 Headers - User ID: {x_user_id}, Role: {x_user_role}")

    sender_id = get_user_id_from_header(x_user_id)
    sender_role = x_user_role or "teacher"  # Default to teacher for backward compatibility
    
    print(f"🔍 Processed - Sender ID: {sender_id}, Role: {sender_role}")
    
    # Get receiver ID with backward compatibility
    receiver_id = request.get_receiver_id()
    if not receiver_id:
        raise HTTPException(status_code=400, detail="Receiver ID required (receiver_id or parent_id)")

    print(f"🔍 Receiver ID: {receiver_id}")

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Determine direction based on sender role
    if sender_role == "teacher":
        direction = "teacher_to_parent"
        valid_types = TEACHER_MESSAGE_TYPES
    else:
        direction = "parent_to_teacher"
        valid_types = PARENT_MESSAGE_TYPES

    # Validate message type
    msg_type = request.message_type if request.message_type in valid_types else "general"

    try:
        # Support both old and new schema simultaneously
        data = {
            # New schema columns
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "direction": direction,
            # Old schema columns for backward compatibility
            "teacher_id": sender_id if sender_role == "teacher" else receiver_id,  # teacher is either sender (if teacher) or receiver (if parent)
            "parent_id": receiver_id if sender_role == "teacher" else sender_id,   # parent is either receiver (if teacher sends) or sender (if parent sends)
            # Common columns
            "message": request.message.strip(),
            "message_type": msg_type,
            "is_read": False,
        }

        if request.child_id:
            data["child_id"] = request.child_id

        print(f"🔍 Inserting data: {data}")

        response = supabase.table("teacher_parent_messages").insert(data).execute()

        if response.data:
            print(f"✅ Message inserted successfully: {response.data[0]}")
            return {
                "success": True,
                "message": "Message sent successfully",
                "message_id": response.data[0].get("id"),
                "data": response.data[0]
            }

        raise HTTPException(status_code=500, detail="Failed to send message")

    except Exception as e:
        print(f"❌ Error sending message: {e}")
        raise HTTPException(status_code=500, detail=f"Error sending message: {str(e)}")
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/messages/received")
async def get_received_messages(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    limit: int = 50,
    unread_only: bool = False
):
    """
    Get messages received by the current user (works for both teacher and parent).

    Headers:
        X-User-Id: User's ID
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    user_id = get_user_id_from_header(x_user_id)

    try:
        # Try new schema first
        query = supabase.table("teacher_parent_messages")\
            .select("*")\
            .eq("receiver_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)

        if unread_only:
            query = query.eq("is_read", False)

        response = query.execute()
        
        # Handle both new and old schema
        if response.data:
            return format_messages_response(response.data, supabase)
        else:
            # Fallback to old schema if no data with new schema
            return {"messages": [], "total": 0, "unread_count": 0}

    except Exception as e:
        print(f"Error fetching messages (new schema): {e}")
        
        # Try old schema format
        if "receiver_id" in str(e) or "sender_id" in str(e):
            try:
                print("Attempting with old schema format...")
                old_query = supabase.table("teacher_parent_messages")\
                    .select("*")\
                    .eq("parent_id", user_id)\
                    .order("created_at", desc=True)\
                    .limit(limit)
                
                if unread_only:
                    old_query = old_query.eq("is_read", False)
                
                old_response = old_query.execute()
                return format_old_messages_response(old_response.data or [], supabase)
                
            except Exception as old_e:
                print(f"Old schema also failed: {old_e}")
        
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")


def format_messages_response(messages_data, supabase):
    """Format messages for new schema"""
    messages = []
    unread_count = 0

    for msg in messages_data:
        # Fetch sender name
        sender_name = "Unknown"
        try:
            sender_response = supabase.table("users")\
                .select("name, role")\
                .eq("id", msg["sender_id"])\
                .single()\
                .execute()
            if sender_response.data:
                sender_name = sender_response.data.get("name", "Unknown")
        except:
            pass

        messages.append({
            "id": msg["id"],
            "sender_id": msg["sender_id"],
            "message": msg["message"],
            "message_type": msg["message_type"],
            "is_read": msg["is_read"],
            "created_at": msg["created_at"],
            "sender_name": sender_name
        })

        if not msg["is_read"]:
            unread_count += 1

    return {
        "messages": messages,
        "total": len(messages),
        "unread_count": unread_count
    }


def format_old_messages_response(messages_data, supabase):
    """Format messages for old schema"""
    messages = []
    unread_count = 0

    for msg in messages_data:
        # Fetch teacher name for old schema
        teacher_name = "Teacher"
        try:
            teacher_response = supabase.table("users")\
                .select("name")\
                .eq("id", msg["teacher_id"])\
                .single()\
                .execute()
            if teacher_response.data:
                teacher_name = teacher_response.data.get("name", "Teacher")
        except:
            pass

        messages.append({
            "id": msg["id"],
            "teacher_id": msg["teacher_id"],
            "message": msg["message"],
            "message_type": msg["message_type"],
            "is_read": msg["is_read"],
            "created_at": msg["created_at"],
            "teacher_name": teacher_name
        })

        if not msg["is_read"]:
            unread_count += 1

    return {
        "messages": messages,
        "total": len(messages),
        "unread_count": unread_count
    }


@router.get("/messages/sent")
async def get_sent_messages(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    limit: int = 50
):
    """
    Get messages sent by the current user (works for both teacher and parent).
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    user_id = get_user_id_from_header(x_user_id)

    try:
        response = supabase.table("teacher_parent_messages")\
            .select("*")\
            .eq("sender_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()

        messages = []
        for msg in response.data or []:
            # Fetch receiver name
            receiver_name = "Unknown"
            try:
                receiver_response = supabase.table("users")\
                    .select("name, role")\
                    .eq("id", msg["receiver_id"])\
                    .single()\
                    .execute()
                if receiver_response.data:
                    receiver_name = receiver_response.data.get("name", "Unknown")
            except:
                pass

            messages.append({
                "id": msg["id"],
                "receiver_id": msg["receiver_id"],
                "receiver_name": receiver_name,
                "message": msg["message"],
                "message_type": msg["message_type"],
                "direction": msg["direction"],
                "is_read": msg["is_read"],
                "created_at": msg["created_at"],
            })

        return {
            "messages": messages,
            "total": len(messages)
        }

    except Exception as e:
        print(f"Error fetching sent messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Keep backward compatibility endpoints
@router.get("/messages/parent")
async def get_parent_messages(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    limit: int = 50,
    unread_only: bool = False
):
    """Backward compatible: Parent fetches messages from teachers."""
    return await get_received_messages(x_user_id, limit, unread_only)


@router.get("/messages/teacher")
async def get_teacher_messages(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    limit: int = 50
):
    """Backward compatible: Teacher fetches messages (both sent and received)."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    user_id = get_user_id_from_header(x_user_id)

    try:
        # Get sent messages
        sent_response = supabase.table("teacher_parent_messages")\
            .select("*")\
            .eq("sender_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()

        # Get received messages (complaints/doubts from parents)
        received_response = supabase.table("teacher_parent_messages")\
            .select("*")\
            .eq("receiver_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()

        sent_messages = []
        for msg in sent_response.data or []:
            receiver_name = "Parent"
            try:
                r = supabase.table("users").select("name").eq("id", msg["receiver_id"]).single().execute()
                if r.data:
                    receiver_name = r.data.get("name", "Parent")
            except:
                pass

            sent_messages.append({
                "id": msg["id"],
                "parent_id": msg["receiver_id"],
                "parent_name": receiver_name,
                "message": msg["message"],
                "message_type": msg["message_type"],
                "is_read": msg["is_read"],
                "created_at": msg["created_at"],
                "direction": "sent"
            })

        received_messages = []
        unread_count = 0
        for msg in received_response.data or []:
            sender_name = "Parent"
            try:
                r = supabase.table("users").select("name").eq("id", msg["sender_id"]).single().execute()
                if r.data:
                    sender_name = r.data.get("name", "Parent")
            except:
                pass

            received_messages.append({
                "id": msg["id"],
                "parent_id": msg["sender_id"],
                "parent_name": sender_name,
                "message": msg["message"],
                "message_type": msg["message_type"],
                "is_read": msg["is_read"],
                "created_at": msg["created_at"],
                "direction": "received"
            })

            if not msg["is_read"]:
                unread_count += 1

        return {
            "sent_messages": sent_messages,
            "received_messages": received_messages,
            "total_sent": len(sent_messages),
            "total_received": len(received_messages),
            "unread_count": unread_count
        }

    except Exception as e:
        print(f"Error fetching teacher messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/messages/read")
async def mark_messages_as_read(
    request: MarkReadRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Mark messages as read (works for both teacher and parent)."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    user_id = get_user_id_from_header(x_user_id)

    if not request.message_ids:
        raise HTTPException(status_code=400, detail="No message IDs provided")

    try:
        response = supabase.table("teacher_parent_messages")\
            .update({
                "is_read": True,
                "read_at": datetime.utcnow().isoformat()
            })\
            .eq("receiver_id", user_id)\
            .in_("id", request.message_ids)\
            .execute()

        return {
            "success": True,
            "message": f"Marked {len(request.message_ids)} message(s) as read"
        }

    except Exception as e:
        print(f"Error marking messages as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/messages/unread-count")
async def get_unread_count(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Get count of unread messages for current user."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    user_id = get_user_id_from_header(x_user_id)

    try:
        response = supabase.table("teacher_parent_messages")\
            .select("id", count="exact")\
            .eq("receiver_id", user_id)\
            .eq("is_read", False)\
            .execute()

        return {"unread_count": response.count or 0}

    except Exception as e:
        print(f"Error getting unread count: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/by-role/{role}")
async def get_users_by_role(
    role: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """
    Get list of users by role (for selecting message recipients).

    Path params:
        role: 'parent' or 'teacher'
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    if role not in ["parent", "teacher"]:
        raise HTTPException(status_code=400, detail="Invalid role. Use 'parent' or 'teacher'")

    try:
        response = supabase.table("users")\
            .select("id, name, email")\
            .eq("role", role)\
            .execute()

        users = [
            {
                "id": u["id"],
                "name": u.get("name", role.capitalize()),
                "email": u.get("email", "")
            }
            for u in response.data or []
        ]

        return {"users": users, "total": len(users)}

    except Exception as e:
        print(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Keep old endpoint for backward compatibility
@router.get("/parents/list")
async def get_parents_list(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Backward compatible: Get list of parents."""
    result = await get_users_by_role("parent", x_user_id)
    return {"parents": result["users"]}
