# SciNexus - Sistema de Eventos Científicos Online

**Universidade Federal de Alagoas (UFAL)**  
**Disciplina:** Engenharia de Software  
**Autor:** Filipe Simões Mota  

---

## 📌 Sobre o Projeto
O **SciNexus** é uma plataforma digital projetada para o gerenciamento de eventos científicos, congressos e conferências. O sistema automatiza o ciclo de vida de um evento acadêmico, desde a criação da agenda até a submissão de artigos (*papers*), processo de revisão por pares (*peer-review*) e emissão de certificados.

O projeto foi desenvolvido com foco em escalabilidade e manutenibilidade, aplicando o padrão arquitetural de **Microserviços** no backend e **Componentes de Software** no frontend.

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