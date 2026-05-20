COMPOSE ?= docker compose
AUTH_SERVICE := auth-service
EVENT_SERVICE := event-service
SUBMISSION_SERVICE := submission-service
SERVICES := $(AUTH_SERVICE) $(EVENT_SERVICE) $(SUBMISSION_SERVICE)
AUTH_DATABASE_URL ?= postgresql+psycopg://user:password@localhost:5432/auth_db
EVENT_DATABASE_URL ?= postgresql+psycopg://user:password@localhost:5432/event_db
SUBMISSION_DATABASE_URL ?= postgresql+psycopg://user:password@localhost:5432/submission_db

.PHONY: help build build-auth build-event build-submission start start-auth start-event start-submission up down down-auth down-event down-submission recreate recreate-auth run-auth run-event run-submission recreate-event recreate-submission restart db-up logs logs-auth logs-event logs-submission ps clean migrate migrate-event migrate-submission revision revision-event revision-submission upgrade upgrade-event upgrade-submission downgrade downgrade-event downgrade-submission

help:
	@echo "Targets disponíveis:"
	@echo "  make build               - builda todos os serviços FastAPI"
	@echo "  make build-auth          - builda auth-service"
	@echo "  make build-event         - builda event-service"
	@echo "  make build-submission    - builda submission-service"
	@echo "  make start               - sobe todos os serviços em segundo plano"
	@echo "  make start-auth          - sobe auth-service"
	@echo "  make start-event         - sobe event-service"
	@echo "  make start-submission    - sobe submission-service"
	@echo "  make down                - derruba todos os serviços"
	@echo "  make down-auth           - para auth-service"
	@echo "  make down-event          - para event-service"
	@echo "  make down-submission     - para submission-service"
	@echo "  make recreate            - derruba e sobe novamente com build"
	@echo "  make recreate-auth       - recria auth-service"
	@echo "  make recreate-event      - recria event-service"
	@echo "  make recreate-submission - recria submission-service"
	@echo "  make run-auth            - roda o auth-service localmente com o Postgres do Docker"
	@echo "  make run-event           - roda o event-service localmente com o Postgres do Docker"
	@echo "  make run-submission      - roda o submission-service localmente com o Postgres do Docker"
	@echo "  make db-up               - sobe apenas o banco do Docker"
	@echo "  make logs                - acompanha os logs de todos"
	@echo "  make logs-auth           - logs do auth-service"
	@echo "  make logs-event          - logs do event-service"
	@echo "  make logs-submission     - logs do submission-service"
	@echo "  make ps                  - lista os containers"
	@echo "  make clean               - derruba e remove volumes"
	@echo "  make migrate             - aplica as migrações do auth-service"
	@echo "  make migrate-event       - aplica as migrações do event-service"
	@echo "  make migrate-submission  - aplica as migrações do submission-service"
	@echo "  make revision            - cria uma migration nova com autogenerate"
	@echo "  make revision-event      - cria uma migration do event-service"
	@echo "  make revision-submission - cria uma migration do submission-service"
	@echo "  make upgrade             - sobe para a última migration"
	@echo "  make upgrade-event       - sobe event-service para a última migration"
	@echo "  make upgrade-submission  - sobe submission-service para a última migration"
	@echo "  make downgrade           - volta uma migration"
	@echo "  make downgrade-event     - volta uma migration do event-service"
	@echo "  make downgrade-submission - volta uma migration do submission-service"

build:
	$(COMPOSE) build $(SERVICES)

build-auth:
	$(COMPOSE) build $(AUTH_SERVICE)

build-event:
	$(COMPOSE) build $(EVENT_SERVICE)

build-submission:
	$(COMPOSE) build $(SUBMISSION_SERVICE)

start up:
	$(COMPOSE) up -d $(SERVICES)

start-auth:
	$(COMPOSE) up -d $(AUTH_SERVICE)

start-event:
	$(COMPOSE) up -d $(EVENT_SERVICE)

start-submission:
	$(COMPOSE) up -d $(SUBMISSION_SERVICE)

down:
	$(COMPOSE) down

down-auth:
	$(COMPOSE) stop $(AUTH_SERVICE)

down-event:
	$(COMPOSE) stop $(EVENT_SERVICE)

down-submission:
	$(COMPOSE) stop $(SUBMISSION_SERVICE)

recreate restart:
	$(COMPOSE) up -d --build --force-recreate $(SERVICES)

recreate-auth:
	$(COMPOSE) up -d --build --force-recreate $(AUTH_SERVICE)

recreate-event:
	$(COMPOSE) up -d --build --force-recreate $(EVENT_SERVICE)

recreate-submission:
	$(COMPOSE) up -d --build --force-recreate $(SUBMISSION_SERVICE)

db-up:
	$(COMPOSE) up -d db

run-auth:
	$(COMPOSE) up -d db
	DATABASE_URL=$(AUTH_DATABASE_URL) uv run --directory $(AUTH_SERVICE) uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-event:
	$(COMPOSE) up -d db
	DATABASE_URL=$(EVENT_DATABASE_URL) uv run --directory $(EVENT_SERVICE) uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-submission:
	$(COMPOSE) up -d db
	DATABASE_URL=$(SUBMISSION_DATABASE_URL) uv run --directory $(SUBMISSION_SERVICE) uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

logs:
	$(COMPOSE) logs -f $(SERVICES)

logs-auth:
	$(COMPOSE) logs -f $(AUTH_SERVICE)

logs-event:
	$(COMPOSE) logs -f $(EVENT_SERVICE)

logs-submission:
	$(COMPOSE) logs -f $(SUBMISSION_SERVICE)

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down -v

migrate:
	DATABASE_URL=$(AUTH_DATABASE_URL) uv run --directory $(AUTH_SERVICE) alembic upgrade head

migrate-event:
	DATABASE_URL=$(EVENT_DATABASE_URL) uv run --directory $(EVENT_SERVICE) alembic upgrade head

migrate-submission:
	DATABASE_URL=$(SUBMISSION_DATABASE_URL) uv run --directory $(SUBMISSION_SERVICE) alembic upgrade head

revision:
	DATABASE_URL=$(AUTH_DATABASE_URL) uv run --directory $(AUTH_SERVICE) alembic revision --autogenerate -m "update models"

revision-event:
	DATABASE_URL=$(EVENT_DATABASE_URL) uv run --directory $(EVENT_SERVICE) alembic revision --autogenerate -m "update models"

revision-submission:
	DATABASE_URL=$(SUBMISSION_DATABASE_URL) uv run --directory $(SUBMISSION_SERVICE) alembic revision --autogenerate -m "update models"

upgrade:
	DATABASE_URL=$(AUTH_DATABASE_URL) uv run --directory $(AUTH_SERVICE) alembic upgrade head

upgrade-event:
	DATABASE_URL=$(EVENT_DATABASE_URL) uv run --directory $(EVENT_SERVICE) alembic upgrade head

upgrade-submission:
	DATABASE_URL=$(SUBMISSION_DATABASE_URL) uv run --directory $(SUBMISSION_SERVICE) alembic upgrade head

downgrade:
	DATABASE_URL=$(AUTH_DATABASE_URL) uv run --directory $(AUTH_SERVICE) alembic downgrade -1

downgrade-event:
	DATABASE_URL=$(EVENT_DATABASE_URL) uv run --directory $(EVENT_SERVICE) alembic downgrade -1

downgrade-submission:
	DATABASE_URL=$(SUBMISSION_DATABASE_URL) uv run --directory $(SUBMISSION_SERVICE) alembic downgrade -1