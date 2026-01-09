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