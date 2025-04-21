from fastapi import UploadFile
import os
from app.repository.media_repository import save_file, delete_file, save_photo_metadata
from app.config import get_settings


async def save_image(file: UploadFile) -> str:
    filepath = os.path.join(get_settings().upload_dir, file.filename)
    await save_file(file, filepath)
    return f"/static/uploads/{file.filename}"


async def save_img_metadata_in_db(title: str, description: str, url: str):
    size = os.path.getsize(url)
    await save_photo_metadata(title, description, url, size)


async def delete_image(filename: str) -> bool:
    filepath = os.path.join(get_settings().upload_dir, filename)
    res = await delete_file(filepath)
    if res:
        return True
    return False
