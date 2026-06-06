from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.event_relation import EventRelationRole, EventRelationStatus


class EventRelationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    user_id: int
    role: EventRelationRole
    status: EventRelationStatus
    approved_by_user_id: int | None
    created_at: datetime
    updated_at: datetime


class ReviewerApplicationCreate(BaseModel):
    user_id: int = Field(gt=0)


class ReviewerDecisionCreate(BaseModel):
    organizer_user_id: int = Field(gt=0)


class SubscriptionCreate(BaseModel):
    user_id: int = Field(gt=0)
