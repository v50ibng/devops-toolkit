// Always use /api as the base path.
// In development: Vite dev server proxies /api/* → http://localhost:3001 (see vite.config.js).
// In Docker: nginx proxies /api/* → backend:3001 (see nginx.conf).
export const API_BASE = '/api';
