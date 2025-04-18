from fastapi import APIRouter, UploadFile, File, Depends
from app.services.db import get_database
from app.services.media_service import save_image

from sqlalchemy import text

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
async def upload_img(file: UploadFile = File(...)):
    image_url = await save_image(file)
    return {"img_url" : image_url}
