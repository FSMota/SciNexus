from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    tags: list[str] = Field(default_factory=list)
    full_name: Optional[str] = None


class UserRead(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime
    tags: list[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    tags: list[str] | None = None