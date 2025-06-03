# /src/api/app/routers/users.py
# # FastAPI router for user endpoints: ensures user exists in the database.

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.services.db.database import get_database
from app.services.users_service import get_or_create_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


class EnsureUserExistsRequest(BaseModel):
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    display_name: str = Field(..., description="User display name")
    role: str = Field(..., description="User role")
    auth_provider: str = Field(..., description="Authentication provider")


@router.post("/ensure_exists")
def ensure_user_exists(request: EnsureUserExistsRequest, db: Session = Depends(get_database)):
    # Ensure user exists or create if not present
    user = get_or_create_user(
        db=db,
        id=request.id,
        email=request.email,
        display_name=request.display_name,
        role=request.role,
        auth_provider=request.auth_provider,
    )
    return user
