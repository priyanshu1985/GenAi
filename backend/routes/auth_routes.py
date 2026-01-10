from fastapi import APIRouter, Header, HTTPException
from config import JWT_SECRET
from services.supabase_service import supabase
from models.user_model import UserCreate, UserLogin
from utils import success, error
import jwt
import hashlib
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_token(user_id: str, role: str) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@router.post("/signup")
def signup(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing = supabase.table("users").select("id").eq("email", user_data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        hashed_password = hash_password(user_data.password)

        new_user = {
            "email": user_data.email,
            "password": hashed_password,
            "role": user_data.role,
            "name": user_data.name or user_data.email.split("@")[0]
        }

        # Insert and get the created user
        result = supabase.table("users").insert(new_user).execute()
        user_id = result.data[0]["id"] if result.data else str(uuid.uuid4())

        # Generate token
        token = create_token(user_id, user_data.role)

        return success({
            "user": {
                "id": user_id,
                "email": user_data.email,
                "role": user_data.role,
                "name": new_user["name"]
            },
            "token": token
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(credentials: UserLogin):
    """Login user and return token"""
    try:
        # Find user by email
        result = supabase.table("users").select("*").eq("email", credentials.email).execute()

        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user = result.data[0]

        # Verify password
        hashed_password = hash_password(credentials.password)
        if user.get("password") != hashed_password:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # Generate token
        token = create_token(str(user["id"]), user["role"])

        return success({
            "user": {
                "id": user["id"],
                "email": user["email"],
                "role": user["role"],
                "name": user.get("name")
            },
            "token": token
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
def get_current_user(x_user_id: str = Header(None), authorization: str = Header(None)):
    """Get current user from token or user ID header"""
    try:
        user_id = x_user_id

        # Try to get user_id from Authorization header if x_user_id not provided
        if not user_id and authorization:
            token = authorization.replace("Bearer ", "")
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
                user_id = payload.get("user_id")
            except jwt.ExpiredSignatureError:
                raise HTTPException(status_code=401, detail="Token expired")
            except jwt.InvalidTokenError:
                raise HTTPException(status_code=401, detail="Invalid token")

        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")

        user = supabase.table("users").select("id, email, role, name").eq("id", user_id).execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="User not found")

        return success(user.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
