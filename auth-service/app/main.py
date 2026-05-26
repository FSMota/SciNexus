from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


# Inicializa a aplicação
app = FastAPI(
    title="SciNexus - Auth Service",
    description="Microserviço de Identidade e Autenticação",
    version="1.0.0",
    lifespan=lifespan,
)

# Adiciona CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Auth Service está rodando perfeitamente!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth_router)