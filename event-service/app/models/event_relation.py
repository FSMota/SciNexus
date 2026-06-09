from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, UniqueConstraint, event
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.types import JSON

from app.database import Base


class EventRelationRole(str, Enum):
    ouvinte = "ouvinte"
    pesquisador = "pesquisador"
    revisor = "revisor"
    organizador = "organizador"


class EventRelationStatus(str, Enum):
    pendente = "pendente"
    ativo = "ativo"
    cancelado = "cancelado"
    rejeitado = "rejeitado"


class EventUserRelation(Base):
    __tablename__ = "event_user_relations"
    __table_args__ = (
        UniqueConstraint("event_id", "user_id", "role", name="uq_event_user_role"),
    )

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    role = Column(
        SQLEnum(
            EventRelationRole,
            name="event_relation_role",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
    )
    tags = tags = Column(JSON().with_variant(SQLiteJSON, "sqlite"), nullable=False, default=list)
    status = Column(
        SQLEnum(
            EventRelationStatus,
            name="event_relation_status",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=EventRelationStatus.ativo,
    )
    approved_by_user_id = Column(Integer, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def approve(self, organizer_user_id: int) -> None:
        self.status = EventRelationStatus.ativo
        self.approved_by_user_id = organizer_user_id

    def cancel(self) -> None:
        self.status = EventRelationStatus.cancelado


@event.listens_for(EventUserRelation, "before_insert")
@event.listens_for(EventUserRelation, "before_update")
def _sync_relation_timestamp(mapper, connection, target: EventUserRelation) -> None:
    if target.role == EventRelationRole.revisor and target.status == EventRelationStatus.pendente:
        target.approved_by_user_id = target.approved_by_user_id
