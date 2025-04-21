from fastapi.testclient import TestClient
from fastapi import HTTPException
from app.main import app
from app.config import settings
import io
import pytest
import os


def test_upload_image(tmp_path):
    settings.upload_dir = tmp_path.as_posix()
    os.makedirs(settings.upload_dir, exist_ok=True)
    client = TestClient(app)
    content = b"some img data"
    files = {"file": ("robot.jpg", io.BytesIO(content), "image/jpeg")}
    response = client.post("/media/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "img_url" in data
    assert data["img_url"].endswith("robot.jpg")


def test_delete_image(tmp_path):
    settings.upload_dir = tmp_path.as_posix()
    os.makedirs(settings.upload_dir, exist_ok=True)
    client = TestClient(app)
    content = b"some img data"
    files = {"file": ("robot.jpg", io.BytesIO(content), "image/jpeg")}
    client.post("/media/upload", files=files)
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
