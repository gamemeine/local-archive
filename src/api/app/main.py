from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .routers import search, media
from .services.db import get_engine, Base

from app.config import get_settings

app = FastAPI()

app.include_router(media.router)
app.include_router(search.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    settings = get_settings()
    engine = get_engine(settings)
    Base.metadata.create_all(bind=engine)


@app.get("/")
def hello():
    return "Hey!"

# def get_elasticsearch_client():
#     host = os.getenv("ELASTICSEARCH_HOST", "localhost")
#     return Elasticsearch(f"http://{host}:9200")


# es = get_elasticsearch_client()


# @app.post("/api/items")
# async def create_item(item: ItemCreate):
#     query = Item.__table__.insert().values(
#         name=item.name, description=item.description)
#     item_id = await database.execute(query)

#     # Index in Elasticsearch
#     es.index(index="items", id=item_id, document=item.dict())

#     return {**item.dict(), "id": item_id}
