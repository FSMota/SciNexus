from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slugify import slugify

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
        submissoes_abertas=payload.submissoes_abertas,
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


@router.get("/{event_slug}", response_model=EventRead)
def get_event(event_slug: str, db: Session = Depends(get_db)) -> Event:
    events = db.query(Event).all()

    for event in events:
        if slugify(event.titulo) == event_slug:
            return event

    raise HTTPException(status_code=404, detail="Evento não encontrado")


@router.put("/{event_id}", response_model=EventRead)
def update_event(event_id: int, payload: EventCreate, db: Session = Depends(get_db)):
    """Rota para o Organizador atualizar os dados do evento"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    
    # Atualiza os campos dinamicamente com base no payload do Pydantic
    for key, value in payload.model_dump().items():
        setattr(event, key, value)
        
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """Rota para o Organizador remover o evento do catálogo"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
        
    db.delete(event)
    db.commit()
    return