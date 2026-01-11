from fastapi import APIRouter, Depends, Request
from middlewares.auth_middleware import role_required

router = APIRouter(prefix="/api")

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


@router.get("/users/teachers")
async def get_teachers():
    """Get list of teachers for parent communication"""
    try:
        # Mock teachers data - replace with real database query
        teachers = [
            {
                "id": "teacher-1",
                "name": "Ms. Sarah Johnson",
                "email": "sarah.johnson@school.com",
                "subject": "Mathematics",
                "grade": "Grade 3-5"
            },
            {
                "id": "teacher-2", 
                "name": "Mr. David Smith",
                "email": "david.smith@school.com",
                "subject": "English",
                "grade": "Grade 3-6"
            },
            {
                "id": "teacher-3",
                "name": "Mrs. Emily Wilson",
                "email": "emily.wilson@school.com", 
                "subject": "Science",
                "grade": "Grade 4-6"
            },
            {
                "id": "teacher-4",
                "name": "Mr. Michael Brown",
                "email": "michael.brown@school.com",
                "subject": "Art & Crafts", 
                "grade": "All Grades"
            }
        ]
        
        return {
            "teachers": teachers,
            "total": len(teachers)
        }
    except Exception as e:
        return {
            "teachers": [],
            "total": 0,
            "error": str(e)
        }