# /src/api/app/services/db/comment_out.py
# Pydantic model for outputting comment data.

from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CommentOut(BaseModel):
    id: int
    user_id: str
    content: str
    created_at: datetime
    author_name: str

    model_config = ConfigDict(from_attributes=True)
