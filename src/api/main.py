import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.db import database
from db.models import Base
from dotenv import load_dotenv

APP_ENVIRONMENT = os.getenv("APP_ENVIRONMENT", "Development")

if APP_ENVIRONMENT == "Production":
    load_dotenv('.env.prod')
elif APP_ENVIRONMENT == "Development":
    load_dotenv('.env.local')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Połączenie z bazą danych przy starcie
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
