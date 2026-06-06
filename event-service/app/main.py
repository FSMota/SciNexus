from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.api.routes.event_relations import router as event_relations_router
from app.api.routes.events import router as events_router
from app.database import get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="SciNexus - Event Service",
    description="Microserviço de Eventos",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(events_router)
app.include_router(event_relations_router)


@app.get("/")
def read_root():
    return {"message": "Event Service está rodando perfeitamente!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    return {"status": "connected", "service": "event"}
