import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.es.models import SearchLocation, Coordinates, YearRange
from app.services.es.query import get_query


def test_location_validator_invalid_box():
    # Arrange & Act & Assert
    with pytest.raises(ValueError):
        SearchLocation(
            top_left=Coordinates(lon=10, lat=0),
            bottom_right=Coordinates(lon=5, lat=5),
        )


def test_year_range_validator():
    # Arrange & Act & Assert
    with pytest.raises(ValueError):
        YearRange(year_from=2020, year_to=2019)


def test_get_query_basic():
    # Arrange
    loc = SearchLocation(
        top_left=Coordinates(lon=0, lat=10),
        bottom_right=Coordinates(lon=10, lat=0),
    )
    # Act
    q = get_query(loc, phrase=None, creation_date=None, page=2, size=5)
    # Assert
    assert q["from"] == 10
    assert q["size"] == 5
    assert q["query"]["bool"]["filter"][0]["geo_bounding_box"]


class DummyClient:
    def search(self, index, body):
        source = {
            "id": 1,
            "user_id": "user1",
            "title": "title",
            "description": "desc",
            "privacy": "public",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-02T00:00:00Z",
            "content": "content",
            "photos": [{"id": "photo1", "thumbnail_url": "url"}],
            "location": {"coordinates": {"lon": 0, "lat": 0}},
            "creation_date": {"year": 2025}
        }
        return {"hits": {"hits": [{"_source": source}]}}


@pytest.fixture(autouse=True)
def override_es_client():
    from app.routers.search import get_elasticsearch as get_es_dep
    app.dependency_overrides[get_es_dep] = lambda: DummyClient()
    yield
    app.dependency_overrides.clear()


def test_search_endpoint_returns_list():
    # Arrange
    client = TestClient(app)
    payload = {
        "location": {
            "top_left": {"lon": 0, "lat": 10},
            "bottom_right": {"lon": 10, "lat": 0},
        }
    }
    # Act
    response = client.post("/search/", json=payload)
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["id"] == 1


def test_my_photos_endpoint():
    # Arrange
    client = TestClient(app)
    # Act
    response = client.get("/search/my-photos", params={"user_id": "u1"})
    # Assert
    assert response.status_code == 200
    photos = response.json()
    assert isinstance(photos, list)
