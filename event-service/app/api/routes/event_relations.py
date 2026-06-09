from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import Event
from app.models.event_relation import EventRelationRole, EventRelationStatus, EventUserRelation
from app.schemas.event_relation import (
    EventRelationRead,
    ReviewerApplicationCreate,
    ReviewerDecisionCreate,
    SubscriptionCreate,
)

router = APIRouter(prefix="/events", tags=["event-relations"])


def _get_event(db: Session, event_id: int) -> Event:
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return event


def _get_relation(db: Session, event_id: int, user_id: int, role: EventRelationRole) -> EventUserRelation:
    relation = (
        db.query(EventUserRelation)
        .filter(
            EventUserRelation.event_id == event_id,
            EventUserRelation.user_id == user_id,
            EventUserRelation.role == role,
        )
        .first()
    )
    if relation is None:
        raise HTTPException(status_code=404, detail="Relação não encontrada")
    return relation


def _ensure_organizer(db: Session, event_id: int, organizer_user_id: int) -> EventUserRelation:
    organizer_relation = _get_relation(db, event_id, organizer_user_id, EventRelationRole.organizador)
    if organizer_relation.status != EventRelationStatus.ativo:
        raise HTTPException(status_code=403, detail="Usuário não está autorizado como organizador neste evento")
    return organizer_relation


def _create_or_get_relation(
    db: Session,
    event_id: int,
    user_id: int,
    role: EventRelationRole,
    status: EventRelationStatus,
    tags: list[str] = None,
) -> EventUserRelation:
    relation = (
        db.query(EventUserRelation)
        .filter(
            EventUserRelation.event_id == event_id,
            EventUserRelation.user_id == user_id,
            EventUserRelation.role == role,
        )
        .first()
    )
    if relation is not None:
        relation.status = status
        db.commit()
        db.refresh(relation)
        return relation

    relation = EventUserRelation(event_id=event_id, user_id=user_id, role=role, status=status, tags=tags or [])
    db.add(relation)
    db.commit()
    db.refresh(relation)
    return relation


@router.get("/{event_id}/relations", response_model=list[EventRelationRead])
def list_event_relations(
    event_id: int,
    user_id: int | None = Query(default=None, gt=0),
    role: EventRelationRole | None = None,
    status: EventRelationStatus | None = None,
    db: Session = Depends(get_db),
) -> list[EventUserRelation]:
    _get_event(db, event_id)
    query = db.query(EventUserRelation).filter(EventUserRelation.event_id == event_id)

    if user_id is not None:
        query = query.filter(EventUserRelation.user_id == user_id)
    if role is not None:
        query = query.filter(EventUserRelation.role == role)
    if status is not None:
        query = query.filter(EventUserRelation.status == status)

    return query.order_by(EventUserRelation.created_at.asc()).all()


@router.get("/{event_id}/relations/{user_id}", response_model=list[EventRelationRead])
def list_user_event_relations(event_id: int, user_id: int, db: Session = Depends(get_db)) -> list[EventUserRelation]:
    _get_event(db, event_id)
    return (
        db.query(EventUserRelation)
        .filter(EventUserRelation.event_id == event_id, EventUserRelation.user_id == user_id)
        .order_by(EventUserRelation.created_at.asc())
        .all()
    )


@router.post("/{event_id}/subscriptions", response_model=EventRelationRead, status_code=201)
def subscribe_event(event_id: int, payload: SubscriptionCreate, db: Session = Depends(get_db)) -> EventUserRelation:
    _get_event(db, event_id)
    return _create_or_get_relation(
        db=db,
        event_id=event_id,
        user_id=payload.user_id,
        role=EventRelationRole.ouvinte,
        status=EventRelationStatus.ativo,
    )


@router.delete("/{event_id}/subscriptions/{user_id}", response_model=EventRelationRead)
def cancel_subscription(event_id: int, user_id: int, db: Session = Depends(get_db)) -> EventUserRelation:
    relation = _get_relation(db, event_id, user_id, EventRelationRole.ouvinte)
    relation.cancel()
    db.commit()
    db.refresh(relation)
    return relation


@router.post("/{event_id}/review-applications", response_model=EventRelationRead, status_code=201)
def apply_for_reviewer(
    event_id: int,
    payload: ReviewerApplicationCreate,
    db: Session = Depends(get_db),
) -> EventUserRelation:
    _get_event(db, event_id)
    return _create_or_get_relation(
        db=db,
        event_id=event_id,
        user_id=payload.user_id,
        role=EventRelationRole.revisor,
        status=EventRelationStatus.pendente,
        tags=payload.tags,
    )


@router.post("/{event_id}/review-applications/{user_id}/approve", response_model=EventRelationRead)
def approve_reviewer(
    event_id: int,
    user_id: int,
    payload: ReviewerDecisionCreate,
    db: Session = Depends(get_db),
) -> EventUserRelation:
    _ensure_organizer(db, event_id, payload.organizer_user_id)
    relation = _get_relation(db, event_id, user_id, EventRelationRole.revisor)
    relation.approve(payload.organizer_user_id)
    db.commit()
    db.refresh(relation)
    return relation


@router.post("/{event_id}/review-applications/{user_id}/reject", response_model=EventRelationRead)
def reject_reviewer(
    event_id: int,
    user_id: int,
    payload: ReviewerDecisionCreate,
    db: Session = Depends(get_db),
) -> EventUserRelation:
    _ensure_organizer(db, event_id, payload.organizer_user_id)
    relation = _get_relation(db, event_id, user_id, EventRelationRole.revisor)
    relation.status = EventRelationStatus.rejeitado
    relation.approved_by_user_id = payload.organizer_user_id
    db.commit()
    db.refresh(relation)
    return relation


# Adicione esta rota no seu event_relations.py
@router.get("/user/{user_id}", response_model=list[EventRelationRead])
def list_user_relations_across_events(
    user_id: int,
    role: EventRelationRole | None = None,
    status: EventRelationStatus | None = None,
    db: Session = Depends(get_db),
) -> list[EventUserRelation]:
    query = db.query(EventUserRelation).filter(EventUserRelation.user_id == user_id)

    if role is not None:
        query = query.filter(EventUserRelation.role == role)
    if status is not None:
        query = query.filter(EventUserRelation.status == status)

    return query.order_by(EventUserRelation.created_at.desc()).all()