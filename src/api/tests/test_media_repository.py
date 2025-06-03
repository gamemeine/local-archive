# /src/api/tests/test_media_repository.py
# Tests for media_repository functions: file save/delete, photo metadata, and comments.

import pytest
from fastapi import UploadFile
from io import BytesIO
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.repository.media_repository import (
    save_file,
    delete_file,
    save_photo_metadata,
    save_new_comment_in_db,
    get_media_comments_from_db,
)
from app.services.db.models import Base, Media, Photo


def make_upload_file(content: bytes, filename: str = 'test.txt'):
    file = BytesIO(content)
    upload = UploadFile(filename=filename, file=file)
    return upload


def setup_in_memory_db():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def test_save_and_delete_file(tmp_path):
    # Arrange
    content = b'hello world'
    upload = make_upload_file(content)
    dest = tmp_path / 'uploads' / 'file.txt'
    # Act
    save_file(upload, str(dest))
    # Assert
    assert dest.exists()
    assert dest.read_bytes() == content

    deleted = delete_file(str(dest))
    assert deleted
    assert not dest.exists()
    assert not delete_file(str(dest))


def test_save_photo_metadata_and_photo_saved():
    # Arrange
    session = setup_in_memory_db()
    # Act
    media = save_photo_metadata(
        title="Title",
        description="Desc",
        url="http://example.com/photo.jpg",
        size=123,
        session=session,
        user_id=1,
    )
    # Assert
    assert isinstance(media.id, int)
    photos = session.query(Photo).filter_by(media_id=media.id).all()
    assert len(photos) == 1
    file_urls = [p.file_url for p in photos]
    assert "http://example.com/photo.jpg" in file_urls


def test_save_new_comment_db_success():
    # Arrange
    session = setup_in_memory_db()
    media = Media(id=1, user_id=1, title="Title",
                  description="", privacy="Public")
    session.add(media)
    session.commit()
    photo = Photo(
        media_id=1,
        file_url="url",
        thumbnail_url="url",
        storage_provider="Local",
        file_size=10,
    )
    session.add(photo)
    session.commit()
    # Act
    comment = save_new_comment_in_db(
        media_id=1,
        user_id=2,
        comment_txt="Nice",
        session=session,
    )
    # Assert
    assert comment.id is not None
    comments = get_media_comments_from_db(1, session)
    assert any(c.id == comment.id for c in comments)


def test_save_new_comment_db_no_media(session=None):
    session = setup_in_memory_db()
    # Act & Assert
    with pytest.raises(ValueError, match="Media not found"):
        save_new_comment_in_db(media_id=999, user_id=1,
                               comment_txt="X", session=session)


def test_save_new_comment_db_no_photo():
    session = setup_in_memory_db()
    media = Media(id=1, user_id=1, title='T', description='', privacy='Public')
    session.add(media)
    session.commit()
    # Act & Assert
    with pytest.raises(ValueError, match='Photo not associated'):
        save_new_comment_in_db(media_id=1, user_id=1,
                               comment_txt='X', session=session)


def test_get_media_comments_from_db_returns_empty():
    session = setup_in_memory_db()
    # Act
    comments = get_media_comments_from_db(media_id=1, session=session)
    # Assert
    assert comments == []
