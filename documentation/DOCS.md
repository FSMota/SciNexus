# SciNexus - Sistema de Eventos Científicos Online

**Universidade Federal de Alagoas (UFAL)**  
**Disciplina:** Engenharia de Software  
**Autor:** Filipe Simões Mota  

---

## 📌 Sobre o Projeto
O **SciNexus** é uma plataforma digital projetada para o gerenciamento de eventos científicos, congressos e conferências. O sistema automatiza o ciclo de vida de um evento acadêmico, desde a criação da agenda até a submissão de artigos (*papers*), processo de revisão por pares (*peer-review*) e emissão de certificados.

O projeto foi desenvolvido com foco em escalabilidade e manutenibilidade, aplicando o padrão arquitetural de **Microserviços** no backend e **Componentes de Software** no frontend.

## 🏗️ Arquitetura e Decisões de Design
* **Padrão Arquitetural:** Microservices.
* **Comunicação:** Síncrona via HTTP/REST.
* **Autenticação:** JWT (JSON Web Tokens) com validação *Stateless* entre os serviços.
* **Isolamento de Dados:** Padrão *Database-per-Service* (Isolamento lógico no PostgreSQL).
* **Infraestrutura:** Conteinerização completa com Docker e Docker Compose, utilizando monorepo.

## 🚀 Stack Tecnológica
* **Frontend:** Next.js (React) - *Arquitetura baseada em Componentes*
* **Backend:** FastAPI (Python) - *Gerenciamento de pacotes via `uv`*
* **Banco de Dados:** PostgreSQL
* **Orquestração:** Docker & Docker Compose

## 👥 Atores do Sistema
1. **Organizador:** Cria e configura o evento, define datas, trilhas e gerencia certificados.
2. **Autor/Pesquisador:** Submete artigos em PDF para avaliação e acompanha o status.
3. **Avaliador (Revisor):** Acessa as submissões atribuídas, lê os documentos e emite pareceres/notas.
4. **Participante (Ouvinte):** Inscreve-se no evento, visualiza a agenda e recebe certificados.

## 📋 Requisitos do Sistema

### Requisitos Funcionais (RF)
* **RF01:** O sistema deve permitir o cadastro e autenticação de usuários com diferentes perfis.
* **RF02:** O sistema deve permitir a criação de eventos (nome, data, descrição e cronograma).
* **RF03:** O sistema deve permitir a submissão de arquivos PDF (artigos/resumos) por autores.
* **RF04:** O sistema deve distribuir os artigos submetidos para os avaliadores.
* **RF05:** O sistema deve permitir que avaliadores registrem notas e comentários para os artigos.
* **RF06:** O sistema deve permitir a inscrição de participantes (ouvintes) nos eventos.
* **RF07:** O sistema deve gerar e disponibilizar certificados em PDF para participantes e autores.

### Requisitos Não Funcionais (RNF)
* **RNF01 (Arquitetura):** O backend deve ser estruturado em microserviços independentes.
* **RNF02 (Componentização):** O frontend deve utilizar componentes React reutilizáveis.
* **RNF03 (Segurança):** A comunicação interna e a autorização devem utilizar tokens JWT.
* **RNF04 (Portabilidade):** Todos os serviços devem ser executáveis via contêineres Docker.
* **RNF05 (Desempenho):** A consulta à agenda do evento deve suportar alta concorrência.

## 📦 Estrutura de Microserviços
O ecossistema é dividido nos seguintes serviços independentes:

1. **`auth-service` (Porta 8001):** Responsável pela identidade, cadastro, login e emissão de JWT. Conecta-se ao banco `auth_db`.
2. **`event-service` (Porta 8002):** Gerencia o CRUD de eventos, agenda, palestrantes e inscrições. Conecta-se ao banco `event_db`.
3. **`submission-service` (Porta 8003):** Lida com upload de arquivos, atribuição de revisores e notas. Conecta-se ao banco `submission_db`.
4. **`frontend` (Porta 3000):** Interface do usuário em Next.js atuando como cliente consumidor das APIs.

## 🛠️ Como Executar o Projeto Localmente

**Pré-requisitos:**
* Docker e Docker Compose instalados.
* Git.

**Passos:**
1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/scinexus.git](https://github.com/seu-usuario/scinexus.git)
   cd scinexus