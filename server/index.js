import express from 'express';
import cors from 'cors';
import sslRouter from './routes/ssl.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/ssl', sslRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`DevOps Toolkit backend listening on http://localhost:${PORT}`);
});
