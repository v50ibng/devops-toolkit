# devops-toolkit
A web UI that simplifies DevOps tasks — OpenSSL certificate tools, JWT decoder, and more.

## Features

- 🔐 **Extract CA from Host** — Fetch and display CA certificate(s) from any live host using OpenSSL
- 🔗 **Certificate Chain Viewer** — Visualise the full cert chain (Leaf → Intermediate → Root) for any host
- 📄 **Certificate Details** — Paste a PEM certificate to inspect Subject, Issuer, SANs, Validity, Fingerprint
- 🪙 **Decode JWT** — Decode and inspect JWT header and payload in-browser

## Running with Docker

The easiest way to run the full stack is with Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed

### Start

```bash
docker compose up --build
```

The app will be available at **http://localhost**.

- Frontend (nginx) — port **80**
- Backend (Express) — port **3001** (also reachable at `/api/` via the nginx proxy)

### Stop

```bash
docker compose down
```

### Architecture

```
Browser → nginx:80 → /api/* → Express:3001 → openssl CLI
                   → /*     → Vite build (static)
```

nginx serves the pre-built React app and proxies all `/api/` traffic to the Express backend container, so no CORS headers are needed in production.

## Running the full stack

### Prerequisites
- Node.js 18+
- OpenSSL installed and in your `PATH`

### Development

```bash
# Terminal 1 — Backend (Express API on port 3001)
cd server && npm install && npm start

# Terminal 2 — Frontend (Vite dev server on port 5173)
npm install && npm run dev
```

Or run both together with:
```bash
npm install
npm run dev:all
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ssl/extract-ca` | Extract CA cert(s) from a remote host |
| `POST` | `/api/ssl/cert-chain` | Fetch full certificate chain from a remote host |

**Request body** (both endpoints):
```json
{ "host": "github.com", "port": 443 }
```

## Project structure

```
Dockerfile            Multi-stage build: Vite → nginx
nginx.conf            nginx config (SPA fallback + /api proxy)
docker-compose.yml    Compose file wiring frontend + backend
server/
  Dockerfile          Node 20 + openssl image for the backend
  index.js            Express server entry point (port 3001)
  routes/ssl.js       SSL-related API routes
  utils/openssl.js    Wrapper around openssl CLI commands
  utils/parser.js     Parse openssl output into structured data
  package.json
src/
  components/
    ssl/              Extract CA, Cert Chain, Cert Details components
    jwt/              Decode JWT component
    layout/           Sidebar
    ui/               Shared UI primitives (Card, Spinner, etc.)
  App.jsx
  main.jsx
```

