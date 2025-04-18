from fastapi import UploadFile
import os
from app.repository.media_repository import save_file
from app.config import get_settings


async def save_image(file: UploadFile) -> str:
    filepath = os.path.join(get_settings().upload_dir, file.filename)
    await save_file(file, filepath)
    return f"/static/uploads/{file.filename}"
