from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from contextlib import asynccontextmanager

from environment import setup
from db.db import get_database
from db.models import Base

setup()
database = get_database()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    engine = create_engine(str(database.url))
    Base.metadata.create_all(bind=engine)

    yield

    await database.disconnect()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}


@app.get("/api/data")
async def get_data():
    query = "SELECT * FROM items"
    result = await database.fetch_all(query)
    return result
