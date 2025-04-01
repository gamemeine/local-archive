import os
from databases import Database


def get_database():
    url = os.getenv("DATABASE_URL")
    return Database(url)
