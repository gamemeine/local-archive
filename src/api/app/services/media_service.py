from fastapi import UploadFile
import os
from app.repository.media_repository import save_file, delete_file, save_photo_metadata
from app.config import settings


def save_image(file: UploadFile) -> str:
    filepath = os.path.join(settings.upload_dir, file.filename)
    save_file(file, filepath)
    return f"/static/uploads/{file.filename}"


def save_img_metadata_in_db(file: UploadFile, title: str, description: str, url: str, db, user_id: int) -> bool:
    filepath = os.path.join(settings.upload_dir, file.filename)
    size = os.path.getsize(filepath)
    return save_photo_metadata(title, description, url, size, db, user_id)


def delete_image(filename: str) -> bool:
    filepath = os.path.join(settings.upload_dir, filename)
    res = delete_file(filepath)
    return res
