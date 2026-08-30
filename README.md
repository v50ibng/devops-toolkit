# devops-toolkit
A web UI that simplifies DevOps tasks — OpenSSL certificate tools, JWT decoder, and more.

## Features

- 🔐 **Extract CA from Host** — Fetch and display CA certificate(s) from any live host using OpenSSL
- 🔗 **Certificate Chain Viewer** — Visualise the full cert chain (Leaf → Intermediate → Root) for any host
- 📄 **Certificate Details** — Paste a PEM certificate to inspect Subject, Issuer, SANs, Validity, Fingerprint
- 🪙 **Decode JWT** — Decode and inspect JWT header and payload in-browser

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
server/
  index.js          Express server entry point (port 3001)
  routes/ssl.js     SSL-related API routes
  utils/openssl.js  Wrapper around openssl CLI commands
  utils/parser.js   Parse openssl output into structured data
  package.json
src/
  components/
    ssl/            Extract CA, Cert Chain, Cert Details components
    jwt/            Decode JWT component
    layout/         Sidebar
    ui/             Shared UI primitives (Card, Spinner, etc.)
  App.jsx
  main.jsx
```

