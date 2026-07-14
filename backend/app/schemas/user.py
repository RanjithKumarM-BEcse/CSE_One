from typing import Optional
from pydantic import BaseModel, EmailStr
from enum import Enum

class RoleEnum(str, Enum):
    admin = "admin"
    professor = "professor"
    faculty_advisor = "faculty_advisor"
    student = "student"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: RoleEnum
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    hashed_password: str

class UserResponse(UserBase):
    id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
