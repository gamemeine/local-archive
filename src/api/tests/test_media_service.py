from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
import io
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
