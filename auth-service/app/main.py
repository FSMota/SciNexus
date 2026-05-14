from contextlib import asynccontextmanager

from fastapi import FastAPI
from .models import User, UserCreate, UserResponse
from .utils.security import hash_password
from app.database import Base, SessionLocal, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# Inicializa a aplicação
app = FastAPI(
    title="SciNexus - Auth Service",
    description="Microserviço de Identidade e Autenticação",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
def read_root():
    return {"message": "Auth Service está rodando perfeitamente!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate):
    db = SessionLocal()
    # Hash password
    hashed_pwd = hash_password(user.password)
    
    # Create DB object
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_pwd,
        full_name=user.full_name
    )
    
    # Save to DB
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user