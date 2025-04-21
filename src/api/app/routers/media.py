from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from app.services.db import get_database
from app.services.media_service import (save_image, delete_image,
                                        save_img_metadata_in_db)

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(
    prefix="/media",
    tags=["media"],
)


@router.get("/")
def get_media(db=Depends(get_database)):
    query = text("SELECT * FROM media")
    result = db.execute(query)
    return result.fetchall()


@router.post("/upload")
async def upload_img(
        title: str = Form(...),
        description: str = Form(...),
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_database)
):
    image_url = await save_image(file)
    save_img_metadata_in_db(file, title, description, image_url, db)
    return {"img_url": image_url}


@router.delete("/delete/{filename}")
async def delete_img(filename: str):
    deleted = await delete_image(filename)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message deleted sucessfully"}
