# /src/api/app/repository/media_repository.py
# Repository functions for Media, Photo, and Comment models.

import shutil
import os
from app.services.db.models import Media, Photo, Comment, CommentPhoto
from fastapi import UploadFile
from datetime import datetime, timezone


def save_file(file: UploadFile, destination: str):
    # Save uploaded file to destination
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)


def delete_file(filepath: str) -> bool:
    # Delete file from filesystem
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False


def save_photo_metadata(
    title: str,
    description: str,
    url: str,
    size: int,
    session,
    user_id: int
):
    # Save photo and media metadata to database
    new_media = Media(
        user_id=user_id,
        title=title,
        description=description,
        privacy="Public"
    )
    session.add(new_media)
    session.flush()

    new_photo = Photo(
        media_id=new_media.id,
        file_url=url,
        thumbnail_url=url,  # TODO only for now
        storage_provider="LocalStorageProvider",
        file_size=size
    )
    session.add(new_photo)
    session.commit()
    session.refresh(new_media)
    return new_media


def save_new_comment_in_db(media_id: int, user_id: int, comment_txt: str, session):
    # Save new comment and link to photo
    media = (
        session.query(Media)
        .outerjoin(Photo, Media.id == Photo.media_id)
        .filter(Media.id == media_id)
        .first()
    )

    if not media:
        raise ValueError("Media not found")

    if not media.photo:
        raise ValueError("Photo not associated with this media")

    new_comment = Comment(
        media_id=media_id,
        user_id=user_id,
        content=comment_txt,
        created_at=datetime.now(timezone.utc)
    )

    session.add(new_comment)
    session.flush()  # Ensures new_comment.id is available

    comment_photo = CommentPhoto(
        comment_id=new_comment.id,
        photo_id=media.photo.id
    )

    session.add(comment_photo)
    session.commit()
    session.refresh(new_comment)
    return new_comment


def get_media_comments_from_db(
        media_id: int,
        session):
    # Retrieve all comments for a media item
    comments = session.query(Comment).filter(
        Comment.media_id == media_id).all()
    return comments
