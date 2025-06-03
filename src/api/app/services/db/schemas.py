# /src/api/app/services/db/schemas.py
# Pydantic schemas for database models.

from pydantic import BaseModel


class ItemCreate(BaseModel):
    name: str
    description: str
