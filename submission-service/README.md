# Submission Service

Microserviço de submissões do SciNexus.

## Rodar localmente

```bash
uv run --directory submission-service uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Migrações

```bash
uv run --directory submission-service alembic revision --autogenerate -m "update models"
uv run --directory submission-service alembic upgrade head
```
