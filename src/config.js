// In development (npm run dev) falls back to the local backend on port 3001.
// In Docker (VITE_API_BASE=/api) nginx proxies /api/* to the backend container.
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';
