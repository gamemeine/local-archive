from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.db import get_database
from app.services.access_request_service import (
    create_access_request_service,
    update_access_request_service,
    change_access_request_status_service,
    delete_access_request_service,
    get_all_access_requests_service
)

router = APIRouter(
    prefix="/access-request",
    tags=["access-request"],
)


@router.get("/")
def get_all_access_requests(db: Session = Depends(get_database)):
    return get_all_access_requests_service(db)


@router.post("/")
def create_access_request(
    media_id: int,
    requester_id: int,
    justification: str,
    db: Session = Depends(get_database)
):
    return create_access_request_service(media_id, requester_id, justification, db)


@router.put("/{request_id}")
def update_access_request(
    request_id: int,
    justification: str,
    db: Session = Depends(get_database)
):
    return update_access_request_service(request_id, justification, db)


@router.patch("/{request_id}/status")
def change_access_request_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_database)
):
    return change_access_request_status_service(request_id, status, db)


@router.delete("/{request_id}")
def delete_access_request(
    request_id: int,
    db: Session = Depends(get_database)
):
    return delete_access_request_service(request_id, db)
