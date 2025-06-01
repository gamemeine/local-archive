# /src/api/app/routers/search.py
# FastAPI router for search endpoints using Elasticsearch.

from fastapi import APIRouter, Depends
from pydantic import BaseModel, model_validator
from app.services.es import get_elasticsearch, get_query, SearchLocation, YearRange, MediaDocument

router = APIRouter(
    prefix="/search",
    tags=["search"],
)


class MediaSearchRequest(BaseModel):
    location: SearchLocation
    phrase: str | None = None
    creation_date: YearRange | None = None
    page: int = 0
    size: int = 10

    @model_validator(mode='after')
    def validate_location(self):
        if not self.location:
            raise ValueError("Location must be provided")
        return self

    @model_validator(mode='after')
    def validate_paging(self):
        if self.page < 0:
            raise ValueError("Page must be greater than or equal to 0")
        if self.size <= 0:
            raise ValueError("Size must be greater than 0")
        if self.size > 100:
            raise ValueError("Size must be less than or equal to 100")
        return self


@router.post("/")
async def search(request: MediaSearchRequest, client=Depends(get_elasticsearch)):
    # Search media in Elasticsearch
    body = get_query(request.location, request.phrase,
                     request.creation_date, request.page, request.size)
    result = client.search(index="media_index", body=body)

    media = []
    for hit in result["hits"]["hits"]:
        document = MediaDocument(**hit["_source"])
        media.append(document)

    return media


@router.get("/my-photos")
def get_my_photos(
    user_id: str,
    es=Depends(get_elasticsearch)
):
    # Get all photos for a specific user from Elasticsearch
    query = {
        "query": {
            "term": {
                "user_id": user_id
            }
        }
    }
    result = es.search(index="media_index", body=query)
    return [hit["_source"] for hit in result["hits"]["hits"]]
