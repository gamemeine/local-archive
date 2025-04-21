import shutil
import os
from fastapi import UploadFile


async def save_file(file: UploadFile, destination: str):
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)


async def delete_file(filepath: str) -> bool:
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False
