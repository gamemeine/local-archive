from pydantic import BaseModel
from datetime import datetime

class AccessRequestOut(BaseModel):
    id: int
    media_id: int
    requester_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
