# Usamos uma imagem Python leve
FROM python:3.12-slim

# Instalamos o uv para gerenciar o projeto
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY pyproject.toml uv.lock ./

# Instala as dependências sem criar um ambiente virtual dentro do container
RUN uv sync --frozen --no-dev

# Copia o restante do código
COPY . .

# Expõe a porta (será diferente para cada serviço no compose)
EXPOSE 8000

# Comando para rodar a aplicação usando o FastAPI CLI
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--port", "8000"]