import shutil
import os
from app.services.db.models import Media, Photo
from fastapi import UploadFile


def save_file(file: UploadFile, destination: str):
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)


def delete_file(filepath: str) -> bool:
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
        thumbnail_url="abc",
        storage_provider="LocalStorageProvider",
        file_size=size
    )
    session.add(new_photo)
    session.commit()
    session.refresh(new_media)
    return new_media
