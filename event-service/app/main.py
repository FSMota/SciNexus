from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.api.routes.event_relations import router as event_relations_router
from app.api.routes.events import router as events_router
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    # Permite a origem do seu frontend Next.js
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    # O "*" permite todos os métodos (GET, POST, PUT, DELETE, OPTIONS)
    allow_methods=["*"], 
    # O "*" permite todos os cabeçalhos (Authorization, Content-Type, etc.)
    allow_headers=["*"], 
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
