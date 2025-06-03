# /src/api/app/services/access_request_service.py
# Service functions for access request logic: wraps repository functions.

from app.repository.access_request_repository import (
    create_access_request_repo,
    update_access_request_repo,
    change_access_request_status_repo,
    delete_access_request_repo,
    get_all_access_requests_repo
)
from sqlalchemy.orm import Session


def get_all_access_requests_service(db: Session):
    return get_all_access_requests_repo(db)


def create_access_request_service(media_id: int, requester_id: int, justification: str, db: Session):
    return create_access_request_repo(media_id, requester_id, justification, db)


def update_access_request_service(request_id: int, justification: str, db: Session):
    return update_access_request_repo(request_id, justification, db)


def change_access_request_status_service(request_id: int, status: str, db: Session):
    return change_access_request_status_repo(request_id, status, db)


def delete_access_request_service(request_id: int, db: Session):
    return delete_access_request_repo(request_id, db)
