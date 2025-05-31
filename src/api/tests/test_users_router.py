import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(autouse=True)
def override_users_deps(monkeypatch):
    from app.routers.users import get_database as get_db_dep
    app.dependency_overrides[get_db_dep] = lambda: None
    monkeypatch.setattr(
        'app.routers.users.get_or_create_user',
        lambda db, id, email, display_name, role, auth_provider: {
            'id': id,
            'email': email,
            'display_name': display_name,
            'role': role,
            'auth_provider': auth_provider
        }
    )
    yield
    app.dependency_overrides.clear()


def test_ensure_user_exists_router():
    client = TestClient(app)
    payload = {
        'id': 'u1',
        'email': 'e@mail',
        'display_name': 'User One',
        'role': 'tester',
        'auth_provider': 'auth0'
    }
    # Act
    response = client.post('/users/ensure_exists', json=payload)
    # Assert
    assert response.status_code == 200
    assert response.json() == payload
