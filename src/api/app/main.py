# /src/api/app/main.py
# Main FastAPI application setup: configures routers, middleware, database, Elasticsearch, and error handling.

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
    # Load settings and prepare static files directory
    settings = get_settings()
    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    # Initialize database if it doesn't exist and create tables
    engine = get_engine(settings)
    if not database_exists(engine.url):
        create_database(engine.url)
        print(f"Created database {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("Database tables created or already exist.")

    # Initialize Elasticsearch index with geo_point mapping
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
    # Run setup tasks on application startup
    setup()
    yield

# Create FastAPI app with custom lifespan
app = FastAPI(lifespan=lifespan)

# Register API routers
app.include_router(media.router)
app.include_router(access_request.router)
app.include_router(search.router)
app.include_router(users.router)

# Enable CORS for all origins and methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    # Simple health check endpoint
    return "Hey!"


@app.exception_handler(RequestValidationError)
async def value_error_exception_handler(request: Request, exc: RequestValidationError):
    # Custom handler for validation errors
    print(f"ValueError: {exc}")
    return JSONResponse(
        status_code=400,
        content={"problems": [e['msg'] for e in exc.errors()]},
    )
