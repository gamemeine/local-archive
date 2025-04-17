from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import search, media
from .services.db import get_engine, Base
from .services.es import get_elasticsearch

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

    # setup database
    engine = get_engine(settings)
    Base.metadata.create_all(bind=engine)

    # setup elasticsearch
    client = get_elasticsearch(settings)
    client.indices.create(index="media_index", ignore=400)


@app.get("/")
def hello():
    return "Hey!"