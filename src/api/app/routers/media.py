from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, Path
from app.services.db import get_database
from app.services.media_service import (save_image, delete_image,
                                        save_img_metadata_in_db, add_comment_to_media,
                                        get_media_comments)
from app.services.es import get_elasticsearch, MediaDocument
from app.services.es.models import Location, Coordinates, CreationDate, YearRange
from sqlalchemy import text
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/media",
    tags=["media"],
)


@router.get("/")
def get_media(db=Depends(get_database)):
    query = text("SELECT * FROM media")
    result = db.execute(query)
    rows = result.fetchall()
    for row in rows:
        print(type(row), row)
    return [dict(row._mapping) for row in rows]

@router.post("/upload")
def upload_img(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    lat: float = Form(None),
    lon: float = Form(None),
    year: int = Form(None),
    month: int = Form(None),
    day: int = Form(None),
    year_from: int = Form(None),
    year_to: int = Form(None),
    db=Depends(get_database),
    es=Depends(get_elasticsearch)
):
    image_url = save_image(file)
    # TODO Pass user_id=1 for now
    new_media = save_img_metadata_in_db(file, title, description, image_url, db, user_id=1)

    # Always provide a Location object
    if lat is not None and lon is not None:
        location = Location(coordinates=Coordinates(lat=lat, lon=lon))
    else:
        location = None  # Do not index location if not provided

    if year_from and year_to:
        creation_date = CreationDate(year_range=YearRange(year_from=year_from, year_to=year_to))
    elif year and year != 0:
        creation_date = CreationDate(year=year, month=month, day=day)
    else:
        raise HTTPException(status_code=400, detail="Either year_range or year must be provided")

    es_doc = MediaDocument(
        id=new_media.id,
        user_id=new_media.user_id or 1,  # fallback to 1 if None
        title=title,
        description=description,
        privacy=new_media.privacy,
        created_at=str(new_media.created_at),
        updated_at=str(new_media.updated_at),
        photos=[{"id": file.filename, "thumbnail_url": image_url}],
        location=location,
        creation_date=creation_date
    )
    print(new_media.id)

    a = es.index(index="media_index", id=str(new_media.id), body=es_doc.model_dump())

    print(a)
    return {"img_url": image_url}


@router.post("/{media_id}/comments")
def add_comment(
    media_id: int = Path(...),
    comment_txt: str = Form(...),
    db: Session=Depends(get_database)
    ):
    user_id = 1 # TODO for now
    added_comment = add_comment_to_media(media_id, user_id, comment_txt, db)
    return {"New comment id": added_comment.id}

@router.get("/{media_id}/comments")
def get_comments(
    media_id: int = Path(...),
    db: Session=Depends(get_database)
    ):
    return get_media_comments(media_id, db)

@router.delete("/delete/{filename}")
async def delete_img(filename: str):
    deleted = await delete_image(filename)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message deleted sucessfully"}
