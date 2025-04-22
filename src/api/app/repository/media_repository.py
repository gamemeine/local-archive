import shutil
import os
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.db.models import Media, Photo
from fastapi import UploadFile


async def save_file(file: UploadFile, destination: str):
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)


async def delete_file(filepath: str) -> bool:
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False


def save_photo_metadata(
            title: str,
            description: str,
            url: str,
            size: int,
            session: AsyncSession,
            ):
    new_media = Media(
        user_id=None,
        title=title,
        description=description,
        privacy="Public"
    )
    session.add(new_media)

    new_photo = Photo(
        media=new_media,
        file_url=url,
        thumbnail_url="abc",
        storage_provider="LocalStorageProvider",
        file_size=size
    )
    session.add(new_photo)
    session.commit()
    session.refresh(new_media)
    return new_media
