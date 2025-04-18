from fastapi import UploadFile
import os

UPLOAD_DIR = "app/static/uploads"


async def save_image(file: UploadFile) -> str:
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    await save_file(file, filepath)

    return f"/static/uploads/{filename}"
