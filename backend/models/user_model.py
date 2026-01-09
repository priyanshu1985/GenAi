from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: str
    email: str
    role: str
    name: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    role: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str