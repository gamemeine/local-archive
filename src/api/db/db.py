import os
from databases import Database


def get_database():
    url = os.getenv("DATABASE_URL")
    print(f"Connecting to database at {url}")

    return Database(url)
