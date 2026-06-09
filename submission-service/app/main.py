from contextlib import asynccontextmanager
import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import get_db, Base, engine
from app.api.routes.submissions import router as submissions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="SciNexus - Submission Service",
    description="Microserviço de Submissões",
    version="1.0.0",
    lifespan=lifespan,
)

# 2. Garanta que a pasta existe antes de montar
os.makedirs("uploads/pdfs", exist_ok=True)

# 3. Monte a pasta para a web!
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Permite requisições de qualquer porta (ideal para dev local)
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
