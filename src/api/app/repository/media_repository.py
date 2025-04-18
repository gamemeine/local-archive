import shutil
from fastapi import UploadFile


async def save_file(file: UploadFile, destination: str):
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)
