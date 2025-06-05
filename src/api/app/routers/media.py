# /src/api/app/routers/media.py
# FastAPI router for media endpoints: upload, retrieve, comment, delete, privacy.

from fastapi import HTTPException, APIRouter, UploadFile, File, Depends, Form, Path, Body
from app.services.db import get_database
from pydantic import BaseModel
from app.services.db.models import CreationDate, Location, Media, PhotoContent
from app.services.db.comment_out import CommentOut
from app.services.db.access_request_out import AccessRequestOut

from app.services.media_service import (
    add_media,
    change_media_privacy,
    delete_media,
    get_media,
    add_comment_to_media,
    get_media_comments,
    send_media_access_request,
    get_media_access_request,
    change_access_request_status,
    get_incoming_user_access_request
)
from app.services.es import get_elasticsearch
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix="/media",
    tags=["media"],
)


@router.get("/{media_id}")
def find(
    media_id: int,
    db=Depends(get_database)
):
    # Get media by ID
    medium = get_media(db, media_id)
    return medium


class UploadMediaRequest:
    def __init__(
        self,
        images: list[UploadFile] = File(default=None),
        user_id: str = Form(...),
        title: str = Form(...),
        description: str = Form(...),
        privacy: str = Form(...),
        content: str = Form(...),
        latitude: float = Form(...),
        longitude: float = Form(...),
        city: str = Form(default=None),
        country: str = Form(default=None),
        postalCode: str = Form(default=None),
        state: str = Form(default=None),
        street: str = Form(default=None),
        creation_date: str = Form(...),
    ):
        self.images = images if images is not None else []
        self.user_id = user_id
        self.title = title
        self.description = description
        self.privacy = privacy
        self.content = content
        self.latitude = latitude
        self.longitude = longitude
        self.city = city
        self.country = country
        self.postalCode = postalCode
        self.state = state
        self.street = street
        self.creation_date = creation_date


@router.post("/upload")
def upload(
    request: UploadMediaRequest = Depends(UploadMediaRequest),
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    medium = Media(
        user_id=request.user_id,
        title=request.title,
        description=request.description,
        privacy=request.privacy
    )

    content = PhotoContent(value=request.content)
    location = Location(
        latitude=request.latitude,
        longitude=request.longitude,
        city=request.city,
        country=request.country,
        postal_code=request.postalCode,
        region=request.state,
        street=request.street,
    )
    creation_date = CreationDate(
        date_from=request.creation_date, date_to=request.creation_date)

    uploaded = add_media(db, es, medium, content, location,
                         creation_date, request.images)
    return uploaded


class AddCommentRequest(BaseModel):
    user_id: str
    text: str


@router.post("/{media_id}/comments")
def add_comment(
    media_id: int,
    request: AddCommentRequest,
    db: Session = Depends(get_database)
):
    # Add comment to media
    added_comment = add_comment_to_media(
        media_id, request.user_id, request.text, db)
    return {"New comment id": added_comment.id}


@router.get("/{media_id}/comments", response_model=List[CommentOut])
def get_comments(
    media_id: int = Path(...),
    db: Session = Depends(get_database)
):
    # Get all comments for a media item
    comments = get_media_comments(media_id, db)
    return [
        CommentOut(
            id=comment.id,
            user_id=comment.user_id,
            content=comment.content,
            created_at=comment.created_at,
            author_name=comment.user.display_name if comment.user else "Nieznany"
        )
        for comment in comments
    ]


@router.delete("/delete/{media_id}")
def delete(
    media_id: int,
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    # Delete media by ID
    delete_media(db, es, media_id)


@router.patch("/privacy/{media_id}")
def change_privacy(
    media_id: int,
    privacy: str = Body(..., embed=True),
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    # Change privacy of a media item
    success = change_media_privacy(db, es, media_id, privacy)
    if not success:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Privacy updated"}


class AccessRequest(BaseModel):
    user_id: str
    justification: str


@router.post("/access-request/{media_id}")
def send_access_request(
    media_id: int,
    request: AccessRequest,
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    print("ODEBRANE ŻĄDANIE:", request)
    print("user_id:", request.user_id)
    success = send_media_access_request(db, es, media_id, request.user_id, request.justification)
    if not success:
        raise HTTPException(status_code=404, detail="Access request send failed.")
    return {"message": "Access request send"}


@router.get("/access-request/{media_id}", response_model=List[AccessRequestOut])
def get_all_access_requests_for_media(
    media_id: int,
    db=Depends(get_database),
):
    requests = get_media_access_request(db, media_id)
    if not requests:
        return []
    return requests


@router.get("/user-access-requests/{user_id}", response_model=List[AccessRequestOut])
def get_all_inocming_access_requests_for_user(
    user_id: str,
    db=Depends(get_database),
):
    requests = get_incoming_user_access_request(db, user_id)
    if not requests:
        return []
    return requests


class AccessRequestUpdate(BaseModel):
    status: str


@router.patch("/access-request/{request_id}")
def update_access_request_status(
    request_id: int = Path(...),
    update: AccessRequestUpdate = Body(...),
    db: Session = Depends(get_database)
):
    success = change_access_request_status(db, request_id, update.status)
    if not success:
        raise HTTPException(status_code=404, detail="Access request not found.")

    return {"message": f"Access request {update.status}."}


@router.post("/upload-photo-for-request")
def upload_photo_for_request(
    image: UploadFile = File(...),
    request_id: int = Form(...),
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    # Find the access request
    from app.services.db.models import AccessRequest, Media, Photo
    access_request = db.query(AccessRequest).filter_by(id=request_id).first()
    if not access_request:
        raise HTTPException(status_code=404, detail="Access request not found")
    # Find the media associated with the access request
    media = db.query(Media).filter_by(id=access_request.media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found for this request")
    # Save the photo file
    from app.repository.media_repository import save_file
    import os
    from app.config import settings
    import uuid
    image_id = str(uuid.uuid4())
    filepath = os.path.join(settings.upload_dir, image_id)
    save_file(image, filepath)
    # Create Photo record
    from app.services.db.models import Photo
    size = os.path.getsize(filepath)
    photo = Photo(
        id=image_id,
        media_id=media.id,
        file_url=f"/static/uploads/{image_id}",
        thumbnail_url=f"/static/uploads/{image_id}",
        storage_provider="LocalStorageProvider",
        file_size=size
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return {"message": "Photo uploaded", "photo_id": photo.id, "media_id": media.id}
