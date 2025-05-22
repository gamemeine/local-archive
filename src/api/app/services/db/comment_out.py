from pydantic import BaseModel
from datetime import datetime


class CommentOut(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime
    author_name: str

    class Config:
        orm_mode = True
