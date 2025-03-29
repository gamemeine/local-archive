from databases import Database
import os

# Pobieranie zmiennej środowiskowej z DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/mydatabase")

database = Database(DATABASE_URL)
