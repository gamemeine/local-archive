from fastapi import APIRouter, UploadFile, File, Depends, Form
from app.services.db.models import CreationDate, Location, Media, PhotoContent
from app.services.db import get_database
from app.services.es import get_elasticsearch
from app.services.media_service import add_media, delete_media


router = APIRouter(
    prefix="/media",
    tags=["media"],
)


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
    creation_date = CreationDate(date_from=request.creation_date, date_to=request.creation_date)

    uploaded = add_media(db, es, medium, content, location, creation_date, request.images)
    return uploaded


@router.delete("/{media_id}")
def delete(
    media_id: str,
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    delete_media(db, es, media_id)
