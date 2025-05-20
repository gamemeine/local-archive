from sqlalchemy.orm import Session
from app.services.db.models import User


def get_or_create_user(db: Session, id: str, **kwargs) -> User:
    user = db.query(User).filter(User.id == id).first()
    if user:
        return user

    user = User(id=id, **kwargs)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
