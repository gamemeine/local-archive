from environment import setup
from fastapi import Security, FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from utils import VerifyToken
from db.db import get_database
from db.models import Base


setup()
app = FastAPI()
auth = VerifyToken()

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


@app.get("/api/public")
def public():
    """No access token required to access this route"""

    result = {
        "status": "success",
        "msg": ("Hello from a public endpoint! You don't need to be "
                "authenticated to see this.")
    }
    return result


@app.get("/api/private")
def private(auth_result: str = Security(auth.verify)):
    """A valid access token is required to access this route"""
    return auth_result
