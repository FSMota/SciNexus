from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from app.database import get_db
from app.api.routes.submissions import router as submissions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="SciNexus - Submission Service",
    description="Microserviço de Submissões",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite requisições de qualquer porta (ideal para dev local)
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Permite o header de Authorization com o token JWT
)

@app.get("/")
def read_root():
    return {"message": "Submission Service está rodando perfeitamente!"}

app.include_router(submissions_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    return {"status": "connected", "service": "submission"}
