from fastapi import APIRouter, Depends
from app.services.es import get_elasticsearch

router = APIRouter(
    prefix="/search",
    tags=["search"],
)


@router.post("/")
async def search(client=Depends(get_elasticsearch)):
    result = client.search(index="media_index", query={
        "match_all": {}
    })

    return result
