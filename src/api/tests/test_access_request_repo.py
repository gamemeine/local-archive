import os
import pytest
import sqlalchemy
from testcontainers.postgres import PostgresContainer
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.services.db import Base
from app.services.db.models import AccessRequest, User, Media
from app.repository.access_request_repository import (
    get_all_access_requests_repo,
    create_access_request_repo,
    update_access_request_repo,
    change_access_request_status_repo,
    delete_access_request_repo,
)

# Create an engine fixture that uses a PostgreSQL container.


@pytest.fixture(scope="module")
def engine():
    """Creates a temporary PostgreSQL engine using Testcontainers."""
    with PostgresContainer("postgres:13") as postgres:
        db_url = postgres.get_connection_url()
        os.environ["DATABASE_URL"] = db_url
        settings.database_url = db_url
        engine = sqlalchemy.create_engine(db_url)
        Base.metadata.create_all(bind=engine)
        yield engine
        engine.dispose()

# Create a function-scoped session fixture that starts a new transaction per test.


@pytest.fixture(scope="function")
def session(engine):
    """Provides a new SQLAlchemy session per test, rolling back after each test."""
    connection = engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(bind=connection, expire_on_commit=False)
    session = SessionLocal()
    yield session
    session.close()
    transaction.rollback()
    connection.close()

# Dummy data fixture to insert a valid user and media for the foreign key constraints.


@pytest.fixture
def dummy_data(session):
    """
    Inserts a dummy user and media record for testing.
    These records satisfy the foreign key constraints for AccessRequest.
    """
    user = User(
        email="test@example.com",
        role="tester",
        first_name="Test",
        last_name="User"
    )
    session.add(user)
    session.commit()  # Commit to get a generated user.id

    media = Media(
        user_id=user.id,
        title="Test Media",
        privacy="Public"
    )
    session.add(media)
    session.commit()

    return {"user": user, "media": media}

# ------------------------
# Actual tests start here
# ------------------------


def test_get_all_access_requests(session, dummy_data):
    """Test retrieving all access requests."""
    media_id = dummy_data["media"].id
    user_id = dummy_data["user"].id
    new_request = AccessRequest(
        media_id=media_id,
        requester_id=user_id,
        justification="Need access",
        status="Pending"
    )
    session.add(new_request)
    session.commit()

    requests = get_all_access_requests_repo(session)
    assert any(req.justification == "Need access" for req in requests)


def test_create_access_request(session, dummy_data):
    """Test creating an access request."""
    media_id = dummy_data["media"].id
    user_id = dummy_data["user"].id
    new_request = create_access_request_repo(
        media_id, user_id, "Requesting access", session
    )
    assert new_request.media_id == media_id
    assert new_request.requester_id == user_id
    assert new_request.justification == "Requesting access"
    assert new_request.status == "Pending"


def test_update_access_request(session, dummy_data):
    """Test updating an access request's justification."""
    media_id = dummy_data["media"].id
    user_id = dummy_data["user"].id
    new_request = create_access_request_repo(
        media_id, user_id, "Old justification", session
    )
    updated_request = update_access_request_repo(
        new_request.id, "Updated justification", session
    )
    assert updated_request.justification == "Updated justification"


def test_change_access_request_status(session, dummy_data):
    """Test changing an access request's status."""
    media_id = dummy_data["media"].id
    user_id = dummy_data["user"].id
    new_request = create_access_request_repo(
        media_id, user_id, "Justification", session
    )
    updated_request = change_access_request_status_repo(
        new_request.id, "Approved", session
    )
    assert updated_request.status == "Approved"


def test_delete_access_request(session, dummy_data):
    """Test deleting an access request."""
    media_id = dummy_data["media"].id
    user_id = dummy_data["user"].id
    new_request = create_access_request_repo(
        media_id, user_id, "Justification", session
    )
    response = delete_access_request_repo(new_request.id, session)
    assert response == {"message": "Access Request deleted successfully"}
    requests = get_all_access_requests_repo(session)
    assert not any(req.id == new_request.id for req in requests)


def test_update_nonexistent_access_request(session):
    """Test updating a request that doesn't exist."""
    with pytest.raises(ValueError, match="Access Request not found"):
        update_access_request_repo(99999, "Updated justification", session)


def test_change_status_nonexistent_access_request(session):
    """Test changing the status of a nonexistent request."""
    with pytest.raises(ValueError, match="Access Request not found"):
        change_access_request_status_repo(99999, "Approved", session)


def test_delete_nonexistent_access_request(session):
    """Test deleting a request that doesn't exist."""
    with pytest.raises(ValueError, match="Access Request not found"):
        delete_access_request_repo(99999, session)


def test_create_access_request_invalid_media_id(session, dummy_data):
    """Test creating an access request with an invalid media_id."""
    user_id = dummy_data["user"].id
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        create_access_request_repo(
            99999, user_id, "Justification for invalid media", session)


def test_create_access_request_invalid_requester_id(session, dummy_data):
    """Test creating an access request with an invalid requester_id."""
    media_id = dummy_data["media"].id
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        create_access_request_repo(
            media_id, 99999, "Justification for invalid requester", session)
