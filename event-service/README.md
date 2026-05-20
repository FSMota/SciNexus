# Event Service

Microserviço de eventos do SciNexus.

## Rodar localmente

```bash
uv run --directory event-service uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Migrações

```bash
uv run --directory event-service alembic revision --autogenerate -m "update models"
uv run --directory event-service alembic upgrade head
```
