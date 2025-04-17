from fastapi import APIRouter

router = APIRouter(
    prefix="/search",
    tags=["search"],
)

@router.post("/") 
async def search():
    return "hello!"