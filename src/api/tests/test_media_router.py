# /src/api/tests/test_media_router.py
# Tests for media router endpoints using FastAPI TestClient and monkeypatching.

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime


@pytest.fixture(autouse=True)
def override_media_deps(monkeypatch):
    # Override dependencies and service functions for isolated router tests
    from app.routers.media import get_database as db_dep, get_elasticsearch as es_dep
    app.dependency_overrides[db_dep] = lambda: None
    app.dependency_overrides[es_dep] = lambda: None

    import app.routers.media as media_module
    monkeypatch.setattr(media_module, 'get_media', lambda db,
                        media_id: {'id': media_id, 'title': 't'})
    monkeypatch.setattr(media_module, 'add_media', lambda db,
                        es, m, c, loc, cd, imgs: {'id': 1, 'uploaded': True})
    monkeypatch.setattr(media_module, 'add_comment_to_media',
                        lambda mid, uid, txt, db: type('C', (), {'id': 5}))
    monkeypatch.setattr(
        media_module,
        'get_media_comments',
        lambda mid, db: [
            type(
                'C',
                (),
                {
                    'id': 5,
                    'user_id': 'u',
                    'content': 'c',
                    'created_at': datetime.now(),
                    'user': type('U', (), {'display_name': 'name'})
                }
            )
        ]
    )
    monkeypatch.setattr(media_module, 'delete_media', lambda db, es, mid: None)
    monkeypatch.setattr(media_module, 'change_media_privacy',
                        lambda db, es, mid, p: True)
    yield
    app.dependency_overrides.clear()


client = TestClient(app)


def test_find_media():
    # Test GET /media/{media_id}
    response = client.get('/media/123')
    assert response.status_code == 200
    assert response.json()['id'] == 123


def test_upload_media():
    # Test POST /media/upload
    file_content = b'img'
    files = [('images', ('test.png', io.BytesIO(file_content), 'image/png'))]
    data = {
        'user_id': 'u1',
        'title': 't',
        'description': 'd',
        'privacy': 'pub',
        'content': 'c',
        'latitude': '1.23',
        'longitude': '4.56',
        'creation_date': '2025-05-31'
    }
    response = client.post('/media/upload', files=files, data=data)
    assert response.status_code == 200
    assert response.json()['uploaded']


def test_add_and_get_comments():
    # Test POST and GET /media/{media_id}/comments
    payload = {'user_id': 1, 'text': 'hello'}
    response = client.post('/media/123/comments', json=payload)
    assert response.status_code == 200
    assert response.json() == {'New comment id': 5}
    response2 = client.get('/media/123/comments')
    assert response2.status_code == 200
    comments = response2.json()
    assert isinstance(comments, list)
    assert comments[0]['id'] == 5


def test_delete_media_and_change_privacy():
    # Test DELETE /media/delete/{media_id} and PATCH /media/privacy/{media_id}
    r1 = client.delete('/media/delete/123')
    assert r1.status_code == 200
    r2 = client.patch('/media/privacy/456', json={'privacy': 'priv'})
    assert r2.status_code == 200
    assert r2.json() == {'message': 'Privacy updated'}
