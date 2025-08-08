# GLPI Dashboard — Painel em Tempo Real

## Índice
- [Introdução](#introdução)  
- [Tecnologias e Dependências](#tecnologias-e-dependências)  
- [Requisitos](#requisitos)  
- [Arquitetura (Visão Geral)](#arquitetura-visão-geral)  
- [Estrutura de Pastas](#estrutura-de-pastas)  
- [Variáveis de Ambiente](#variáveis-de-ambiente)  
- [Instalação (Dev)](#instalação-dev)  
- [Instalação com Docker](#instalação-com-docker)  
- [Uso](#uso)  
- [Endpoints da API](#endpoints-da-api)  
- [Arquivos Importantes (Compose & Nginx)](#arquivos-importantes-compose--nginx)  
- [Produção (Build & Deploy)](#produção-build--deploy)  
- [Fluxo de Dados & Atualização](#fluxo-de-dados--atualização)  
- [Troubleshooting](#troubleshooting)  
- [Segurança](#segurança)  
- [Roadmap](#roadmap)  

---

## Introdução
Este repositório contém um **painel em tempo quase real** para monitorar chamados do **GLPI**.  
Ele exibe **cards de métricas**, **tabela com filtros** e **alerta sonoro quando chega novo chamado**.  
Stack: **FastAPI (backend)** + **React/Vite/Tailwind (frontend)** + **Nginx** (proxy).

---

## Tecnologias e Dependências

**Backend**
- FastAPI, Uvicorn
- HTTPX (cliente HTTP)
- Pydantic v2 / pydantic-settings (config)
- sse-starlette (Server-Sent Events)

**Frontend**
- React 18 + Vite 5
- Tailwind CSS
- Zustand (estado leve)
- date-fns (datas)

**Infra**
- Docker / Docker Compose
- Nginx (reverse proxy)

---

## Requisitos
- Node.js **v20+**
- Python **3.11+** (se rodar backend localmente sem Docker)
- Docker e Docker Compose (opcional, recomendado)
- Acesso à **API REST do GLPI** + **APP_TOKEN** e **USER_TOKEN**

---

## Arquitetura (Visão Geral)

```
[ Navegador (UI) ]
        │
        ▼
     (Nginx)  ← reverse proxy único (porta 8080 em dev)
   /api   │  \
  ▼       │   ▼
FastAPI   │  Vite (HMR)
(GLPI proxy/cache)  Frontend React
        │
        ▼
      GLPI REST
```

- **frontend (Vite)** → UI (cards, filtros, tabela).  
- **nginx** → proxy único (porta `8080` em dev):  
  - `/api` → **backend (FastAPI)** na `:8000`  
  - `/` → **frontend (Vite)** na `:5173`  
- **backend (FastAPI)** → consulta GLPI, aplica regras e cache:
  - `GET /api/stats` → métricas para os cards
  - `GET /api/tickets` → listagem paginada com filtros
  - `GET /api/events` → **SSE**: evento `new_ticket`

---

## Estrutura de Pastas

```
glpi-dashboard/
├─ README.md
├─ .gitignore
├─ docker-compose.yml                 # Orquestra backend, frontend (dev) e nginx
├─ infra/
│  └─ nginx/
│     └─ default.conf                # Proxy: /api → backend e / → frontend (Vite)
├─ backend/
│  ├─ Dockerfile                     # Imagem do FastAPI
│  ├─ requirements.txt               # Dependências do backend
│  ├─ .env.example                   # Exemplo de variáveis (GLPI_URL, tokens, etc.)
│  └─ app/
│     ├─ __init__.py
│     ├─ main.py                     # App FastAPI, CORS, rotas, startup/shutdown
│     ├─ core/
│     │  ├─ config.py                # Settings (pydantic-settings) lê .env
│     │  └─ cache.py                 # Cache em memória (TTL)
│     ├─ api/
│     │  └─ v1/
│     │     └─ endpoints/
│     │        ├─ stats.py           # GET /api/stats
│     │        ├─ tickets.py         # GET /api/tickets
│     │        └─ events.py          # GET /api/events (SSE)
│     ├─ clients/
│     │  ├─ glpi.py                  # Cliente HTTPX para GLPI (get/post)
│     │  └─ search_map.py            # Mapa dinâmico de campos (list_search_options) + fallback
│     ├─ services/
│     │  ├─ tickets.py               # Regras: filtros, counts, paginação; latest_ticket_id
│     │  └─ sse.py                   # Gerador de eventos SSE (polling)
│     ├─ schemas/
│     │  └─ common.py                # Pydantic models (StatsOut, SearchResponse)
│     └─ utils/
│        ├─ time.py                  # Faixas de data (today) com timezone
│        └─ logging.py               # Configuração simples de logs
└─ frontend/
   ├─ Dockerfile                     # (opcional para build de produção)
   ├─ package.json                   # Scripts: dev/build/preview
   ├─ vite.config.ts                 # Proxy /api → 8000 em dev
   ├─ tsconfig.json
   ├─ .env.example                   # VITE_API_BASE=/api
   ├─ public/
   │  ├─ index.html
   │  └─ ping.mp3                    # Som de novo chamado
   └─ src/
      ├─ main.tsx                    # Bootstrap React
      ├─ App.tsx                     # Layout base
      ├─ pages/
      │  └─ Dashboard.tsx            # Tela principal (cards, filtros, tabela)
      ├─ components/
      │  ├─ cards/StatCard.tsx       # Card de métrica
      │  ├─ filters/                 # Componentes de filtro
      │  └─ table/TicketsTable.tsx   # Tabela com paginação
      ├─ hooks/
      │  ├─ useStats.ts              # Poll em /api/stats
      │  ├─ useSSE.ts                # Conecta em /api/events
      │  └─ useTickets.ts            # Busca paginada com filtros
      ├─ lib/api.ts                  # Wrapper fetch (baseURL)
      ├─ store/filters.ts            # Zustand: estado global de filtros
      └─ styles/index.css            # Tailwind base
```

**O que cada arquivo “chave” faz (resumo):**
- `backend/app/core/config.py` → carrega configs (.env), TTL, fuso, status padrão.  
- `backend/app/clients/*` → comunicação com GLPI e resolução de campos.  
- `backend/app/services/tickets.py` → **coração** do domínio (monta queries, conta, lista).  
- `backend/app/api/v1/endpoints/*` → expõe rotas REST e SSE.  
- `frontend/src/hooks/*` → isolam a lógica de consumo da API e SSE.  
- `infra/nginx/default.conf` → reverse proxy (dev), incluindo suporte a WebSocket/HMR.

---

## Variáveis de Ambiente

**backend/.env**
```ini
GLPI_URL=https://seu-glpi/apirest.php
GLPI_APP_TOKEN=SEU_APP_TOKEN
GLPI_USER_TOKEN=SEU_USER_TOKEN

CACHE_TTL=15
POLL_INTERVAL=10
TIMEZONE=America/Sao_Paulo

OPEN_STATUSES=1,2,3,4
INPROGRESS_STATUSES=2,3,4

CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

**frontend/.env**
```ini
VITE_API_BASE=/api
```

> Dica: Se o GLPI usar outra convenção de status/campos, ajuste `OPEN_STATUSES`, `INPROGRESS_STATUSES` e/ou o mapeamento em `clients/search_map.py`.

---

## Instalação (Dev)

**Backend**
```bash
cd backend
cp .env.example .env  # edite GLPI_URL/APP_TOKEN/USER_TOKEN
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# abra http://localhost:5173
```

---

## Instalação com Docker
Suba tudo de uma vez (backend, frontend em modo dev e nginx como proxy único):

```bash
docker compose up --build
# abra http://localhost:8080
```

- O Nginx faz proxy de `/api` para o backend (8000) e `/` para o Vite (5173).
- HMR do Vite funciona via WebSocket através do Nginx já configurado.

---

## Uso
- Acesse o painel (cards + filtros + tabela).
- Ajuste **status** (ex.: `1,2,3,4`), **técnico**, **categoria** e **período**.  
- Ao chegar um novo chamado, o painel recebe evento **SSE** (`new_ticket`) e toca um **ping** (arquivo `public/ping.mp3`).

> **Regras padrão (ajustáveis no backend):**  
> - **Abertos:** `OPEN_STATUSES` (default `1,2,3,4`)  
> - **Em atendimento:** `INPROGRESS_STATUSES` (default `2,3,4`)  
> - **Realizados hoje:** campo `solvedate` no dia atual (troque para `closedate` se preferir)

---

## Endpoints da API
Base da API (via Nginx): `/api`

### `GET /api/stats`
**Retorna:**
```json
{ "open": 23, "in_progress": 7, "solved_today": 12 }
```

### `GET /api/tickets`
**Query params:**
- `status` (string, ex.: `1,2,3`)
- `technician_id` (int)
- `category_id` (int)
- `source` (string)
- `date_from` (YYYY-MM-DD)
- `date_to` (YYYY-MM-DD)
- `page` (int, default 1)
- `per_page` (int, default 50)

**Retorna (formato da busca do GLPI):**
```json
{
  "totalcount": 120,
  "count": 50,
  "content_range": "0-49/120",
  "data": [ /* linhas conforme campos forçados/exibidos */ ]
}
```

### `GET /api/events` (SSE)
Stream de eventos do tipo:
- `event: new_ticket` → `data: "<id>"`

> Usado pelo frontend para mostrar alerta imediato e tocar som.

---

## Arquivos Importantes (Compose & Nginx)

### `docker-compose.yml`
```yaml
version: "3.9"

services:
  api:
    build: ./backend
    env_file: ./backend/.env
    expose:
      - "8000"
    networks:
      - webnet

  # Frontend em modo DEV (Vite)
  frontend:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm ci && npm run dev -- --host 0.0.0.0"
    environment:
      - VITE_API_BASE=/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    expose:
      - "5173"
    networks:
      - webnet

  nginx:
    image: nginx:1.25-alpine
    depends_on:
      - api
      - frontend
    ports:
      - "8080:80"
    volumes:
      - ./infra/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - webnet

networks:
  webnet:
    driver: bridge
```

### `infra/nginx/default.conf`
```nginx
# DEV: Nginx reverse-proxy
# - /api → api:8000 (FastAPI)
# - /    → frontend:5173 (Vite dev server)

upstream api_upstream {
    server api:8000;
    keepalive 32;
}

upstream fe_upstream {
    # Vite dev server
    server frontend:5173;
    keepalive 32;
}

server {
    listen 80;
    server_name _;

    # Ajustes gerais de proxy
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    # Gzip básico
    gzip on;
    gzip_types text/plain text/css application/json application/javascript application/xml image/svg+xml;
    gzip_min_length 256;

    # API
    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_pass http://api_upstream;
    }

    # Frontend (Vite dev) + suporte a HMR
    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Necessário pro HMR do Vite (websocket)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_pass http://fe_upstream;
    }
}
```

---

## Produção (Build & Deploy)

### Opção A (recomendada): servir o build do frontend pelo Nginx
1. Rodar `npm run build` no frontend → gera `frontend/dist/`.
2. Usar um `Dockerfile` de Nginx que copie `dist/` para `/usr/share/nginx/html`.
3. Nginx com:
   ```nginx
   server {
     listen 80;
     root /usr/share/nginx/html;
     index index.html;

     location /api/ { proxy_pass http://api:8000; }

     # SPA: fallback
     location / { try_files $uri /index.html; }
   }
   ```

### Opção B: manter proxy para um servidor estático externo
- Hospedar o `dist/` (S3/CloudFront/etc.) e deixar Nginx só para `/api`.

**HTTPS:** coloque Nginx atrás de Traefik/Caddy ou configure certificados (Let’s Encrypt).

---

## Fluxo de Dados & Atualização
1. Front chama `GET /api/stats` a cada **10s** (poll) para cards.  
2. Front abre `GET /api/events` (SSE) e recebe `new_ticket` quando surge um chamado mais novo.  
3. Listagem em `GET /api/tickets` aplica **filtros** e **paginação**; o backend **cacheia** respostas por alguns segundos (TTL) para não sobrecarregar o GLPI.

---

## Troubleshooting
- **401/403 no GLPI:** verifique `GLPI_URL`, `APP_TOKEN` e `USER_TOKEN`. Teste a URL `/apirest.php` no navegador (deve responder algo).
- **Campos errados na lista:** `search_map.py` tenta carregar `list_search_options`. Se não bater, ajuste o **FALLBACK** ou envie a **versão do seu GLPI** e mapeamos certinho.
- **Sem som no alerta:** confirme que `public/ping.mp3` existe e que o navegador tem permissão para áudio.
- **Timezone/hoje errado:** ajuste `TIMEZONE` no `.env` e, se necessário, troque `solvedate` por `closedate` em `services/tickets.py`.
- **CORS em dev:** garanta `CORS_ORIGINS` incluindo a origem do frontend (`5173`/`8080`).

---

## Segurança
- **Nunca** faça commit de `.env` com tokens reais.
- Restrinja acesso externo apenas ao Nginx (não exponha Uvicorn diretamente).
- Em produção, ative HTTPS e defina regras de firewall para a rede interna dos containers.

---

## Roadmap
- Cache Redis (substituir cache em memória)
- Filtros por **nome** (autocomplete) em vez de IDs crus
- Badges com cores por status/prioridade
- Autenticação no painel (SAML/LDAP/OIDC)
- Métricas históricas e gráficos (dia/semana/mês)
