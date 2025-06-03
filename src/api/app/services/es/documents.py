# /src/api/app/services/es/documents.py
# Pydantic models for Elasticsearch documents.

from pydantic import BaseModel

from .models import CreationDate, Location, Photo


class MediaDocument(BaseModel):
    id: int
    user_id: str
    title: str
    description: str
    privacy: str
    created_at: str
    updated_at: str
    content: str
    photos: list[Photo]
    location: Location
    creation_date: CreationDate
