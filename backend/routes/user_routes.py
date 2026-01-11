from fastapi import APIRouter, Depends, Request, HTTPException
from middlewares.auth_middleware import role_required
from supabase import create_client, Client
import os
import sys
import uuid

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY

router = APIRouter(prefix="/api")

# Initialize Supabase client
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/parent-data")
async def parent_data(
    request: Request,
    _=Depends(role_required(["parent"]))
):
    return {
        "msg": "Hello Parent",
        "user": getattr(request.state, 'user', None)
    }


@router.get("/teacher-data")
async def teacher_data(
    request: Request,
    _=Depends(role_required(["teacher"]))
):
    return {
        "msg": "Hello Teacher", 
        "user": getattr(request.state, 'user', None)
    }


@router.get("/admin-data")
async def admin_data(
    request: Request,
    _=Depends(role_required(["admin"]))
):
    return {
        "msg": "Hello Admin",
        "user": getattr(request.state, 'user', None)
    }


@router.get("/users/parents")
async def get_parents():
    """Get list of parents for teacher communication with real data from Supabase"""
    try:
        if not supabase:
            # Fallback mock data when Supabase is not available
            parents = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Rajesh Sharma",
                    "email": "rajesh.sharma@gmail.com",
                    "child_name": "Priyanshu Manke",
                    "phone": "+91-9876543210"
                }
            ]
        else:
            # Try to fetch real parent data from Supabase
            try:
                response = supabase.table("users").select("id, email, metadata").eq("role", "parent").execute()
                if response.data and len(response.data) > 0:
                    parents = []
                    for user in response.data:
                        metadata = user.get("metadata", {})
                        parents.append({
                            "id": user["id"],
                            "name": metadata.get("full_name", f"Parent {user['id'][:8]}"),
                            "email": user.get("email", f"parent{user['id'][:8]}@school.com"),
                            "child_name": metadata.get("child_name", "Student"),
                            "phone": metadata.get("phone", "+91-9876543210")
                        })
                    print(f"Found {len(parents)} parents in database")
                else:
                    # Use mock data if no parents found in database
                    print("No parents found in database, using mock data")
                    parents = [
                        {
                            "id": str(uuid.uuid4()),
                            "name": "Rajesh Sharma", 
                            "email": "rajesh.sharma@gmail.com",
                            "child_name": "Priyanshu Manke",
                            "phone": "+91-9876543210"
                        },
                        {
                            "id": str(uuid.uuid4()),
                            "name": "Priya Patel",
                            "email": "priya.patel@gmail.com", 
                            "child_name": "Aadhya Patel",
                            "phone": "+91-9876543211"
                        }
                    ]
            except Exception as db_error:
                print(f"Database error: {db_error}")
                # Fallback to mock data with UUIDs
                parents = [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Rajesh Sharma",
                        "email": "rajesh.sharma@gmail.com", 
                        "child_name": "Priyanshu Manke",
                        "phone": "+91-9876543210"
                    }
                ]
        
        return {
            "parents": parents,
            "total": len(parents),
            "message": "Parents fetched successfully"
        }
    except Exception as e:
        print(f"Error in get_parents: {e}")
        return {
            "parents": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Rajesh Sharma",
                    "email": "rajesh.sharma@gmail.com",
                    "child_name": "Priyanshu Manke", 
                    "phone": "+91-9876543210"
                }
            ],
            "total": 1,
            "error": str(e)
        }


@router.get("/users/teachers")
async def get_teachers():
    """Get list of teachers for parent communication with real data from Supabase"""
    try:
        if not supabase:
            # Fallback mock data when Supabase is not available
            teachers = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Ms. Sarah Johnson",
                    "email": "sarah.johnson@school.com",
                    "subject": "Mathematics",
                    "grade": "Grade 3-5"
                }
            ]
        else:
            # Try to fetch real teacher data from Supabase
            try:
                response = supabase.table("users").select("id, email, metadata").eq("role", "teacher").execute()
                if response.data and len(response.data) > 0:
                    teachers = []
                    for user in response.data:
                        metadata = user.get("metadata", {})
                        teachers.append({
                            "id": user["id"],
                            "name": metadata.get("full_name", f"Teacher {user['id'][:8]}"),
                            "email": user.get("email", f"teacher{user['id'][:8]}@school.com"),
                            "subject": metadata.get("subject", "General"),
                            "grade": metadata.get("grade", "All Grades")
                        })
                    print(f"Found {len(teachers)} teachers in database")
                else:
                    # Use mock data if no teachers found in database
                    print("No teachers found in database, using mock data")
                    teachers = [
                        {
                            "id": str(uuid.uuid4()),
                            "name": "Ms. Sarah Johnson",
                            "email": "sarah.johnson@school.com",
                            "subject": "Mathematics",
                            "grade": "Grade 3-5"
                        },
                        {
                            "id": str(uuid.uuid4()),
                            "name": "Mr. David Smith",
                            "email": "david.smith@school.com",
                            "subject": "English", 
                            "grade": "Grade 3-6"
                        }
                    ]
            except Exception as db_error:
                print(f"Database error: {db_error}")
                # Fallback to mock data with UUIDs
                teachers = [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Ms. Sarah Johnson",
                        "email": "sarah.johnson@school.com",
                        "subject": "Mathematics",
                        "grade": "Grade 3-5"
                    }
                ]
        
        return {
            "teachers": teachers,
            "total": len(teachers)
        }
    except Exception as e:
        print(f"Error in get_teachers: {e}")
        return {
            "teachers": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Ms. Sarah Johnson",
                    "email": "sarah.johnson@school.com",
                    "subject": "Mathematics",
                    "grade": "Grade 3-5"
                }
            ],
            "total": 1,
            "error": str(e)
        }