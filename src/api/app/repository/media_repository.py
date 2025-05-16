import shutil
import os
from sqlalchemy.orm import Session
from app.services.db.models import Media, Photo, PredefinedMetadata, Location
from fastapi import UploadFile
from typing import Tuple, Optional


async def save_file(file: UploadFile, destination: str):
    with open(destination, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)


async def delete_file(filepath: str) -> bool:
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False


def parse_location(location: str) -> Tuple[float]:
    try:
        lat_str, lon_str = location.split(",")
        lat = float(lat_str.strip())
        lon = float(lon_str.strip())
        return lat, lon
    except ValueError:
        print(f"Niepoprawny format lokalizacji: '{location}'")


def save_media_location(
                            lat: float,
                            lon: float,
                            media: Media,
                            session: Session
                            ):
    metadata = PredefinedMetadata(
            media_id=media.id,
            metadata_type="location"
        )
    session.add(metadata)
    session.flush()

    location_obj = Location(
        metadata_id=metadata.id,
        latitude=lat,
        longitude=lon
    )
    session.add(location_obj)


def save_photo_metadata(
            title: str,
            description: str,
            location: Optional[str],
            url: str,
            size: int,
            session: Session,
            ):
    new_media = Media(
        user_id=None,
        title=title,
        description=description,
        privacy="Public"
    )
    session.add(new_media)
    session.flush()

    new_photo = Photo(
        media=new_media,
        file_url=url,
        thumbnail_url="abc",
        storage_provider="LocalStorageProvider",
        file_size=size
    )
    session.add(new_photo)

    if location:
        lat, lon = parse_location(location)
        save_media_location(lat, lon, new_media, session)

    session.commit()
    session.refresh(new_media)
    return new_media
