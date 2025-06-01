# /src/api/app/routers/media.py
# FastAPI router for media endpoints: upload, retrieve, comment, delete, privacy.

from fastapi import HTTPException, APIRouter, UploadFile, File, Depends, Form, Path, Body
from app.services.db import get_database
from pydantic import BaseModel
from app.services.db.models import CreationDate, Location, Media, PhotoContent
from app.services.db.comment_out import CommentOut
from app.services.media_service import (
    add_media,
    change_media_privacy,
    delete_media,
    get_media,
    add_comment_to_media,
    get_media_comments
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
        images: list[UploadFile] = File(...),
        user_id: str = Form(...),
        title: str = Form(...),
        description: str = Form(...),
        privacy: str = Form(...),
        content: str = Form(...),
        latitude: float = Form(...),
        longitude: float = Form(...),
        creation_date: str = Form(...),
    ):
        self.images = images
        self.user_id = user_id
        self.title = title
        self.description = description
        self.privacy = privacy
        self.content = content
        self.latitude = latitude
        self.longitude = longitude
        self.creation_date = creation_date


@router.post("/upload")
def upload(
    request: UploadMediaRequest = Depends(UploadMediaRequest),
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    # Upload new media
    print(request.__dict__)
    medium = Media(
        user_id=request.user_id,
        title=request.title,
        description=request.description,
        privacy=request.privacy
    )

    content = PhotoContent(value=request.content)
    location = Location(
        latitude=request.latitude,
        longitude=request.longitude
    )
    creation_date = CreationDate(
        date_from=request.creation_date, date_to=request.creation_date)

    uploaded = add_media(db, es, medium, content, location,
                         creation_date, request.images)
    return uploaded


class AddCommentRequest(BaseModel):
    user_id: int
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
