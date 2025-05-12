from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class Message(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    is_ai: bool = Field(..., alias="isAI")
    content: str
    timestamp: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "conversationId": 1,
                "senderId": 1,
                "isAI": False,
                "content": "Mensaje de ejemplo",
                "timestamp": "2025-05-11T12:00:00"
            }
        }

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        # Convertir snake_case a camelCase para el frontend
        d["conversationId"] = d.pop("conversation_id")
        d["senderId"] = d.pop("sender_id")
        d["isAI"] = d.pop("is_ai")
        d["timestamp"] = d["timestamp"].isoformat() if isinstance(d["timestamp"], datetime) else d["timestamp"]
        return d

class Conversation(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    messages: List[Message] = []

    class Config:
        from_attributes = True

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        # Convertir snake_case a camelCase para el frontend
        d["userId"] = d.pop("user_id")
        d["createdAt"] = d["created_at"].isoformat() if isinstance(d["created_at"], datetime) else d["created_at"]
        return d

class Topic(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    content: str
    conversationId: int | None = None
    topicId: int | None = None

class ChatResponse(BaseModel):
    message: Message
    conversation: Conversation | None = None

    class Config:
        from_attributes = True
