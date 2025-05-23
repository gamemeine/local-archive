import os
import uuid
from fastapi import UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from elasticsearch import Elasticsearch
from app.config import settings
from app.services.db.models import (Media, Photo, PhotoContent,
                                    PredefinedMetadata, Location, CreationDate)
from app.repository.media_repository import (save_file, delete_file,
                                             save_new_comment_in_db,
                                             get_media_comments_from_db)
from app.services.es.documents import MediaDocument
from app.services.es.models import (
    Photo as ElasticPhoto,
    Location as ElasticLocation,
    Coordinates,
    CreationDate as ElasticCreationDate,
    YearRange
)


class ImageDescriptor(BaseModel):
    id: str
    file_url: str
    thumbnail_url: str
    storage_provider: str
    file_size: int


def _save_image(file: UploadFile) -> ImageDescriptor:
    image_id = str(uuid.uuid4())
    filepath = os.path.join(settings.upload_dir, image_id)

    save_file(file, filepath)
    return _get_image(image_id)


def _get_image(id: str) -> ImageDescriptor:
    filepath = os.path.join(settings.upload_dir, id)
    if not os.path.exists(filepath):
        raise FileNotFoundError(
            f"File {id} not found in {settings.upload_dir}")

    size = os.path.getsize(filepath)
    return ImageDescriptor(
        id=id,
        file_url=f"/static/uploads/{id}",
        thumbnail_url=f"/static/uploads/{id}",
        storage_provider='local',
        file_size=size
    )


def get_media(db: Session, media_id: int) -> Media:
    """
    Get media by ID.
    """
    media = (
        db.query(Media)
        .options(joinedload(Media.photo))
        .filter(Media.id == media_id)
        .first()
    )
    if not media:
        raise ValueError(f"Media with id {media_id} not found")
    return media


def add_media(
    db: Session,
    es: Elasticsearch,
    medium: Media,
    content: PhotoContent,
    location: Location,
    creation_date: CreationDate,
    images: list[UploadFile]
) -> Media:
    """
    Add media to the database and Elasticsearch.
    """
    # Save to database and storage
    db.add(medium)
    db.commit()
    db.refresh(medium)

    photos = []
    for image_file in images:
        image = _save_image(image_file)
        photo = Photo(
            id=image.id,
            media_id=medium.id,
            file_url=image.file_url,
            thumbnail_url=image.thumbnail_url,
            storage_provider=image.storage_provider,
            file_size=image.file_size
        )
        db.add(photo)
        photos.append(photo)

    db.commit()

    def add_metadata(metadata, metadata_type):
        metadata_instance = PredefinedMetadata(media_id=medium.id, metadata_type=metadata_type)
        db.add(metadata_instance)
        db.commit()
        db.refresh(metadata_instance)

        metadata.metadata_id = metadata_instance.id
        db.add(metadata)
        db.commit()

    add_metadata(content, 'content')
    add_metadata(creation_date, 'creation_date')
    add_metadata(location, 'location')

    # Index in Elasticsearch
    document = MediaDocument(
        id=medium.id,
        user_id=medium.user_id,
        title=medium.title,
        description=medium.description,
        privacy=medium.privacy,
        created_at=medium.created_at.isoformat(),
        updated_at=medium.updated_at.isoformat(),
        content=content.value,
        creation_date=ElasticCreationDate(year_range=YearRange(
            year_from=creation_date.date_from.year,
            year_to=creation_date.date_to.year
        )),
        location=ElasticLocation(coordinates=Coordinates(lat=location.latitude, lon=location.longitude)),
        photos=[ElasticPhoto(id=photo.id, thumbnail_url=photo.thumbnail_url) for photo in photos]
    )

    es.index(index=settings.elasticsearch_index,
             id=medium.id, body=document.model_dump())
    return medium


def delete_media(db: Session, es: Elasticsearch, media_id: int) -> bool:
    """
    Delete media from the database, Elasticsearch, and storage.
    """
    # Delete from database
    medium = db.query(Media).filter(Media.id == media_id).first()
    if not medium:
        return False

    db.delete(medium)
    db.commit()

    # Delete from Elasticsearch
    es.delete(index=settings.elasticsearch_index, id=media_id)

    # Delete files from storage
    for photo in medium.photos:
        delete_file(photo.file_url)
    return True


def add_comment_to_media(media_id: int, user_id: int, comment_txt: str, db):
    return save_new_comment_in_db(media_id, user_id, comment_txt, db)


def get_media_comments(media_id: int, db):
    return get_media_comments_from_db(media_id, db)


def delete_image(filename: str) -> bool:
    filepath = os.path.join(settings.upload_dir, filename)
    res = delete_file(filepath)
    return res
