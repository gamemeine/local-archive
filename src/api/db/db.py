import os
from databases import Database


def get_database():
    url = os.getenv("DATABASE_URL")
    if url is None:
        raise ValueError("DATABASE_URL environment variable is not set.")
    print(f"Connecting to database at {url}")
    return Database(url)
