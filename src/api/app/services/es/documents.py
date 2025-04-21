from pydantic import BaseModel

from .models import CreationDate, Location, Photo


class MediaDocument(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    privacy: str
    created_at: str
    updated_at: str
    photos: list[Photo]
    location: Location
    creation_date: CreationDate
