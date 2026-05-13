from fastapi import FastAPI

# Inicializa a aplicação
app = FastAPI(
    title="SciNexus - Auth Service",
    description="Microserviço de Identidade e Autenticação",
    version="1.0.0"
)


@app.get("/")
def read_root():
    return {"message": "Auth Service está rodando perfeitamente!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}