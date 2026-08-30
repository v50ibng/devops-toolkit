# DevOps Toolkit

DevOps Toolkit is a browser-only single-page application for common certificate and JWT workflows. It includes SSL and JWT utilities built with React, Vite, Tailwind CSS, `node-forge`, and `jose`.

## Features

- Dark theme by default with light mode toggle
- Collapsible sidebar with SSL tools, JWT tools, and future placeholders
- SSL utilities:
  - Extract CA from a pasted/uploaded PEM chain
  - Display certificate details
  - Visualize certificate chains
  - Verify certificate/private key matches
  - Convert PEM ↔ DER
  - Generate self-signed certificates
- JWT utilities:
  - Decode JWTs with header/payload/signature panels
  - Validate JWT signatures and expiry state
- Drag-and-drop file uploads, copy buttons, download actions, and toast notifications

## Getting Started

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run Oxlint

## Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

Then open http://localhost:8080.

Build and run with Docker directly:

```bash
docker build -t devops-toolkit .
docker run --rm -p 8080:80 devops-toolkit
```
