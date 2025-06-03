# /src/api/app/services/users_service.py
# Service functions for user logic: get or create user in the database.

from sqlalchemy.orm import Session
from app.services.db.models import User


def get_or_create_user(db: Session, id: str, **kwargs) -> User:
    # Retrieve user by ID or create if not present
    user = db.query(User).filter(User.id == id).first()
    if user:
        return user

    user = User(id=id, **kwargs)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
