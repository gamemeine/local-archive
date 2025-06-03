# /src/api/tests/test_main.py
# Tests for FastAPI main app: root endpoint and validation error handler.

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_returns_hey():
    # Act
    response = client.get("/")
    # Assert
    assert response.status_code == 200
    assert response.json() == "Hey!"


def test_validation_error_handler_for_search():
    # Act
    response = client.post("/search/", json={})
    # Assert
    assert response.status_code == 400
    body = response.json()
    assert "problems" in body
    assert isinstance(body["problems"], list)
    assert len(body["problems"]) > 0
