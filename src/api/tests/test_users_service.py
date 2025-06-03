# /src/api/tests/test_users_service.py
# Tests for user service: get_or_create_user logic.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.db.models import Base, User
from app.services.users_service import get_or_create_user


def setup_memory_db():
    # Setup in-memory SQLite database for testing
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine)()


def test_get_or_create_user_creates_new():
    # Test creating a new user if not present
    session = setup_memory_db()
    user = get_or_create_user(
        db=session,
        id='u1',
        email='e@mail',
        display_name='User',
        role='r',
        auth_provider='p'
    )
    assert getattr(user, "id") == 'u1'
    assert session.query(User).count() == 1


def test_get_or_create_user_returns_existing():
    # Test returning existing user if present
    session = setup_memory_db()
    existing = User(id='u2', email='e2@mail',
                    display_name='Existing', role='r', auth_provider='p')
    session.add(existing)
    session.commit()
    user = get_or_create_user(
        db=session, id='u2', email='x', display_name='x', role='x', auth_provider='x')
    assert getattr(user, "id") == 'u2'
    assert session.query(User).count() == 1
