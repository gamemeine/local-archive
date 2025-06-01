# /src/api/app/services/db/database.py
# Database engine and session utilities for SQLAlchemy.

from fastapi import Depends
from app.config import get_settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def get_engine(settings=Depends(get_settings)):
    # Create SQLAlchemy engine from settings
    url = settings.database_url
    if url is None:
        raise ValueError("DATABASE_URL environment variable is not set.")

    try:
        print(f"Connecting to database at {url}")
        engine = create_engine(url)
        return engine
    except Exception as e:
        raise RuntimeError(f"Failed to connect to the database: {e}")


def get_database(settings=Depends(get_settings)):
    # Dependency for FastAPI: yields a database session
    url = settings.database_url
    if url is None:
        raise ValueError("DATABASE_URL environment variable is not set.")

    db = None
    try:
        print(f"Connecting to database at {url}")
        engine = create_engine(url)
        session_local = sessionmaker(bind=engine)
        db = session_local()
        yield db
    except Exception as e:
        raise RuntimeError(f"Failed to connect to the database: {e}")
    finally:
        if db is not None:
            db.close()
