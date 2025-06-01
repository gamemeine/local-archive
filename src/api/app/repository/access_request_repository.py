# /src/api/app/repository/access_request_repository.py
# Repository functions for AccessRequest model: CRUD operations.

from sqlalchemy import select
from app.services.db.models import AccessRequest
from sqlalchemy.orm import Session


def get_all_access_requests_repo(session: Session):
    # Retrieve all access requests
    result = session.execute(select(AccessRequest))
    return result.scalars().all()


def create_access_request_repo(media_id: int, requester_id: int, justification: str, session: Session):
    # Create a new access request
    new_request = AccessRequest(
        media_id=media_id,
        requester_id=requester_id,
        justification=justification,
        status="Pending"
    )
    session.add(new_request)
    session.commit()
    session.refresh(new_request)
    return new_request


def update_access_request_repo(request_id: int, justification: str, session: Session):
    # Update justification for an access request
    result = session.execute(
        select(AccessRequest).where(AccessRequest.id == request_id)
    )
    request = result.scalars().first()
    if not request:
        raise ValueError("Access Request not found")
    request.justification = justification
    session.commit()
    session.refresh(request)
    return request


def change_access_request_status_repo(request_id: int, status: str, session: Session):
    # Change status of an access request
    result = session.execute(
        select(AccessRequest).where(AccessRequest.id == request_id)
    )
    request = result.scalars().first()
    if not request:
        raise ValueError("Access Request not found")
    request.status = status
    session.commit()
    session.refresh(request)
    return request


def delete_access_request_repo(request_id: int, session: Session):
    # Delete an access request
    result = session.execute(
        select(AccessRequest).where(AccessRequest.id == request_id)
    )
    request = result.scalars().first()
    if not request:
        raise ValueError("Access Request not found")
    session.delete(request)
    session.commit()
    return {"message": "Access Request deleted successfully"}
