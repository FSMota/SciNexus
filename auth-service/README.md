# Auth Service

Microserviço de autenticação do SciNexus com cadastro local, login via JWT e logout com revogação por `token_version`.

## Estrutura

```text
auth-service/
	app/
		main.py
		database.py
		api/
			deps.py
			routes/
				auth.py
		core/
			config.py
			security.py
		models/
			user.py
		schemas/
			auth.py
			user.py
		utils/
			security.py
	alembic/
		versions/
			2a9e7d6d4d10_add_token_version_to_users.py
```

## Instalação

1. Ative o ambiente virtual.

```bash
cd /home/filipemota12/projetos/SciNexus/auth-service
source .venv/bin/activate
```

2. Instale as dependências.

```bash
python -m pip install -U pip
python -m pip install 'python-jose[cryptography]' 'email-validator'
```

3. Aplique as migrações.

```bash
alembic upgrade head
```

4. Suba o serviço.

```bash
fastapi dev app/main.py
```

## Variáveis de ambiente

Defina pelo menos:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM` (opcional, padrão `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (opcional, padrão `30`)

## Fluxo

1. `POST /auth/register` cria o usuário com senha hash.
2. `POST /auth/login` valida email e senha e devolve um JWT.
3. `GET /auth/me` exige `Authorization: Bearer <token>`.
4. `POST /auth/logout` incrementa `token_version` e invalida tokens antigos.

## Observação

O logout aqui é imediato no servidor porque o token traz o número da versão do usuário. Quando a versão muda, tokens antigos deixam de funcionar.
