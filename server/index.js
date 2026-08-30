import express from 'express';
import cors from 'cors';
import sslRouter from './routes/ssl.js';

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api/ssl', sslRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`DevOps Toolkit backend listening on http://localhost:${PORT}`);
});
