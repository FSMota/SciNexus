from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventRead

router = APIRouter(prefix="/events", tags=["events"])


@router.post("", response_model=EventRead, status_code=201)
def create_event(payload: EventCreate, db: Session = Depends(get_db)) -> Event:
    event = Event(
        titulo=payload.titulo,
        categoria=payload.categoria,
        data_inicio=payload.data_inicio,
        data_fim=payload.data_fim,
        local=payload.local,
        status=payload.status,
        resumo=payload.resumo,
        tags=payload.tags,
        numero_participantes=payload.numero_participantes,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("", response_model=list[EventRead])
def getAllEvents(db: Session = Depends(get_db)):
    # retornar todos os eventos
    return db.query(Event).all()