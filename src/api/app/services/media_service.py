from fastapi import UploadFile
import os
from app.repository.media_repository import save_file
from app.config import UPLOAD_DIR


async def save_image(file: UploadFile) -> str:
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    await save_file(file, filepath)

    return f"/static/uploads/{file.filename}"
