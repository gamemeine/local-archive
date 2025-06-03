# /src/api/tests/test_access_request_router.py
# Tests for AccessRequest API router using FastAPI TestClient and monkeypatching.

import pytest
from fastapi.testclient import TestClient
from app.main import app

# Stub service functions
from app.routers.access_request import get_database as get_db_dep

client = TestClient(app)


@pytest.fixture(autouse=True)
def override_access_request_services(monkeypatch):
    # Override dependencies and service functions for isolated router tests
    app.dependency_overrides[get_db_dep] = lambda: None
    monkeypatch.setattr(
        'app.routers.access_request.get_all_access_requests_service',
        lambda db: [{'id': 1, 'justification': 'test'}]
    )
    monkeypatch.setattr(
        'app.routers.access_request.create_access_request_service',
        lambda media_id, requester_id, justification, db: {'id': 2}
    )
    monkeypatch.setattr(
        'app.routers.access_request.update_access_request_service',
        lambda request_id, justification, db: {
            'id': request_id, 'justification': justification}
    )
    monkeypatch.setattr(
        'app.routers.access_request.change_access_request_status_service',
        lambda request_id, status, db: {'id': request_id, 'status': status}
    )
    monkeypatch.setattr(
        'app.routers.access_request.delete_access_request_service',
        lambda request_id, db: {'message': 'deleted'}
    )
    yield
    app.dependency_overrides.clear()


def test_get_all_access_requests_router():
    # Act
    response = client.get("/access-request/")
    # Assert
    assert response.status_code == 200
    assert response.json() == [{'id': 1, 'justification': 'test'}]


def test_create_access_request_router():
    # Act
    response = client.post(
        "/access-request/", params={
            'media_id': 10,
            'requester_id': 20,
            'justification': 'just'
        }
    )
    # Assert
    assert response.status_code == 200
    assert response.json() == {'id': 2}


def test_update_access_request_router():
    # Act
    response = client.put(
        "/access-request/5", params={'justification': 'upd'}
    )
    # Assert
    assert response.status_code == 200
    assert response.json() == {'id': 5, 'justification': 'upd'}


def test_change_status_access_request_router():
    # Act
    response = client.patch(
        "/access-request/7/status", params={'status': 'Approved'}
    )
    # Assert
    assert response.status_code == 200
    assert response.json() == {'id': 7, 'status': 'Approved'}


def test_delete_access_request_router():
    # Act
    response = client.delete("/access-request/9")
    # Assert
    assert response.status_code == 200
    assert response.json() == {'message': 'deleted'}
