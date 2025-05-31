from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from sqlalchemy_utils import database_exists, create_database

from .other import with_retry

from .routers import search, media, access_request, users
from .services.db import get_engine, Base
from .services.es import get_elasticsearch

from app.config import get_settings


@with_retry(retries=5, delay=10)
def setup():
    settings = get_settings()

    # create uploads dir & mount static…
    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    # setup database
    engine = get_engine(settings)
    if not database_exists(engine.url):
        create_database(engine.url)
        print(f"Created database {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("Database tables created or already exist.")

    # setup elasticsearch
    client = get_elasticsearch(settings)
    mapping = {
        "mappings": {
            "properties": {
                "location": {
                    "properties": {
                        "coordinates": {
                            "type": "geo_point"
                        }
                    }
                }
            }
        }
    }
    client.indices.create(index="media_index", body=mapping,
                          ignore=400)  # type: ignore
    print("Elasticsearch index created or already exists.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup()

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(media.router)
app.include_router(access_request.router)
app.include_router(search.router)
app.include_router(users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    return "Hey!"


@app.exception_handler(RequestValidationError)
async def value_error_exception_handler(request: Request, exc: RequestValidationError):
    print(f"ValueError: {exc}")
    return JSONResponse(
        status_code=400,
        content={"problems": [e['msg'] for e in exc.errors()]},
    )
