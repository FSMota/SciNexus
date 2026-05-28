from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.event import EventCategory, EventStatus


class EventCreate(BaseModel):
    titulo: str = Field(min_length=1)
    categoria: EventCategory
    data_inicio: date
    data_fim: date | None = None
    local: str = Field(min_length=1)
    status: EventStatus = EventStatus.inscricoes_abertas
    resumo: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)
    numero_participantes: int = 0


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    categoria: EventCategory
    data_inicio: date
    data_fim: date | None
    local: str
    status: EventStatus
    numero_participantes: int
    destaque: bool
    resumo: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime