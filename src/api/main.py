import os
from environment import setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from db.db import get_database
from db.models import Base
from db.models import Item
from db.schemas import ItemCreate
from elasticsearch import Elasticsearch


setup()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database = get_database()


@app.on_event("startup")
async def startup():
    # Łączenie z bazą
    await database.connect()

    # Tworzenie tabel w bazie danych
    engine = create_engine(str(database.url))
    Base.metadata.create_all(bind=engine)


@app.on_event("shutdown")
async def shutdown():
    # Rozłączanie z bazą
    await database.disconnect()


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}


@app.get("/api/data")
async def get_data():
    query = "SELECT * FROM items"
    result = await database.fetch_all(query)
    return result

# elastic test


def get_elasticsearch_client():
    host = os.getenv("ELASTICSEARCH_HOST", "localhost")
    return Elasticsearch(f"http://{host}:9200")


es = get_elasticsearch_client()


@app.post("/api/items")
async def create_item(item: ItemCreate):
    query = Item.__table__.insert().values(
        name=item.name, description=item.description)
    item_id = await database.execute(query)

    # Index in Elasticsearch
    es.index(index="items", id=item_id, document=item.dict())

    return {**item.dict(), "id": item_id}
