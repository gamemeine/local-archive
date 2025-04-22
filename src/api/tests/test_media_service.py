from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.services.db import Base
import io
import os
import pytest
from testcontainers.postgres import PostgresContainer
import sqlalchemy


@pytest.fixture(scope="module")
def test_db():
    with PostgresContainer("postgres:13") as postgres:
        db_url = postgres.get_connection_url()
        os.environ["DATABASE_URL"] = db_url
        settings.database_url = db_url

        engine = sqlalchemy.create_engine(db_url)
        Base.metadata.create_all(bind=engine)
        yield


def test_upload_image(tmp_path, test_db):
    settings.upload_dir = tmp_path.as_posix()
    os.makedirs(settings.upload_dir, exist_ok=True)
    client = TestClient(app)
    content = b"some img data"
    files = {
        "file": ("robot.jpg", io.BytesIO(content), "image/jpeg")
    }
    data = {
        "title": "Test robot",
        "description": "Test robot description"
    }
    response = client.post("/media/upload", files=files, data=data)
    assert response.status_code == 200
    data = response.json()
    assert "img_url" in data
    assert data["img_url"].endswith("robot.jpg")


def test_delete_image(tmp_path, test_db):
    settings.upload_dir = tmp_path.as_posix()
    os.makedirs(settings.upload_dir, exist_ok=True)
    client = TestClient(app)
    content = b"some img data"
    files = {
        "file": ("robot.jpg", io.BytesIO(content), "image/jpeg")
    }
    data = {
        "title": "Test robot",
        "description": "Test robot description"
    }
    client.post("/media/upload", files=files, data=data)
    file_path = tmp_path / "robot.jpg"
    assert file_path.exists()
    response = client.delete("/media/delete/robot.jpg")
    assert response.status_code == 200
    assert not file_path.exists()


def test_try_to_delete_image_which_doesnt_exists(tmp_path):
    client = TestClient(app)
    response = client.delete("/media/delete/robot.jpg")

    assert response.status_code == 404
    assert response.json() == {"detail": "File not found"}
