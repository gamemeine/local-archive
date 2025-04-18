from fastapi import APIRouter, Depends
from app.services.db import get_database
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
