from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
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
    # Create dir for storing images on server
    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    # setup database
    engine = get_engine(settings)
    Base.metadata.create_all(bind=engine)

    # setup elasticsearch
    client = get_elasticsearch(settings)
    client.indices.create(index="media_index", ignore=400)


@app.get("/")
def hello():
    return "Hey!"
