from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
    client.indices.create(index="media_index", body=mapping, ignore=400)
    print("Elasticsearch index created or already exists.")


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
