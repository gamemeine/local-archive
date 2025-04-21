from fastapi import UploadFile
import os
from app.repository.media_repository import save_file, delete_file, save_photo_metadata
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession


async def save_image(file: UploadFile) -> str:
    filepath = os.path.join(settings.upload_dir, file.filename)
    await save_file(file, filepath)
    return f"/static/uploads/{file.filename}"


def save_img_metadata_in_db(file: UploadFile, title: str, description: str, url: str, db: AsyncSession):
    filepath = os.path.join(settings.upload_dir, file.filename)
    size = os.path.getsize(filepath)
    save_photo_metadata(title, description, url, size, db)


async def delete_image(filename: str) -> bool:
    filepath = os.path.join(settings.upload_dir, filename)
    res = await delete_file(filepath)
    if res:
        return True
    return False
