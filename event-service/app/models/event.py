from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Boolean, Column, Date, DateTime, Enum as SQLEnum, Integer, String, Text, event
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.types import JSON

from app.database import Base


class EventCategory(str, Enum):
    tecnologia = "tecnologia"
    saude = "saúde"
    engenharia = "engenharia"
    educacao = "educação"
    direito = "direito"


class EventStatus(str, Enum):
    inscricoes_abertas = "inscrições abertas"
    inscricoes_encerradas = "inscrições encerradas"


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False, index=True)
    categoria = Column(
        SQLEnum(
            EventCategory,
            name="event_category",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
    )
    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date, nullable=True)
    local = Column(String, nullable=False)
    status = Column(
        SQLEnum(
            EventStatus,
            name="event_status",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=EventStatus.inscricoes_abertas,
    )
    submissoes_abertas = Column(Boolean, nullable=False, default=True)
    numero_participantes = Column(Integer, nullable=False, default=0)
    destaque = Column(Boolean, nullable=False, default=False)
    resumo = Column(Text, nullable=False)
    tags = Column(JSON().with_variant(SQLiteJSON, "sqlite"), nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def sync_destaque(self) -> None:
        if self.numero_participantes > 500:
            self.destaque = True


@event.listens_for(Event, "before_insert")
@event.listens_for(Event, "before_update")
def _sync_event_destaque(mapper, connection, target: Event) -> None:
    target.sync_destaque()