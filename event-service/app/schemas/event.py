from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field
from fastapi import Depends
from app.security import get_usuario_logado_id
from app.models.event import EventCategory, EventStatus


class EventCreate(BaseModel):
    titulo: str = Field(min_length=1)
    categoria: EventCategory
    data_inicio: date
    data_fim: date | None = None
    local: str = Field(min_length=1)
    autor_id: int = Depends(get_usuario_logado_id) 
    status: EventStatus = EventStatus.inscricoes_abertas
    submissoes_abertas: bool = True
    resumo: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)
    numero_participantes: int = 0


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    categoria: EventCategory
    data_inicio: date
    criador_id: int
    data_fim: date | None
    local: str
    status: EventStatus
    submissoes_abertas: bool
    numero_participantes: int
    destaque: bool
    resumo: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime