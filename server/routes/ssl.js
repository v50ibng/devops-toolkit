import { Router } from 'express';
import { validateHost, validatePort, fetchCertChain } from '../utils/openssl.js';
import { extractPemBlocks, parseCert, assignChainPositions } from '../utils/parser.js';

const router = Router();

/**
 * POST /api/ssl/extract-ca
 * Body: { host: string, port: number }
 * Returns: array of cert objects { pem, details }
 */
router.post('/extract-ca', async (req, res) => {
  const { host, port = 443 } = req.body;

  if (!validateHost(host)) {
    return res.status(400).json({ error: 'Invalid hostname. Use alphanumeric characters, dots, and hyphens only.' });
  }
  if (!validatePort(port)) {
    return res.status(400).json({ error: 'Invalid port. Must be an integer between 1 and 65535.' });
  }

  try {
    const { stdout } = await fetchCertChain(host, Number(port));
    const pems = extractPemBlocks(stdout);

    if (pems.length === 0) {
      return res.status(502).json({ error: `No certificates found for ${host}:${port}. Ensure the host is reachable.` });
    }

    // The CA certs are everything except the first (leaf) cert
    const caCerts = pems.length > 1 ? pems.slice(1) : pems;
    const certs = caCerts.map(pem => ({ pem, details: parseCert(pem) }));

    return res.json({ host, port: Number(port), certs });
  } catch (err) {
    if (err.message.includes('timed out')) {
      return res.status(504).json({ error: `Connection to ${host}:${port} timed out.` });
    }
    if (err.code === 'ENOENT') {
      return res.status(500).json({ error: 'openssl is not installed or not in PATH.' });
    }
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

/**
 * POST /api/ssl/cert-chain
 * Body: { host: string, port: number }
 * Returns: array of cert objects with position (Leaf, Intermediate, Root)
 */
router.post('/cert-chain', async (req, res) => {
  const { host, port = 443 } = req.body;

  if (!validateHost(host)) {
    return res.status(400).json({ error: 'Invalid hostname. Use alphanumeric characters, dots, and hyphens only.' });
  }
  if (!validatePort(port)) {
    return res.status(400).json({ error: 'Invalid port. Must be an integer between 1 and 65535.' });
  }

  try {
    const { stdout } = await fetchCertChain(host, Number(port));
    const pems = extractPemBlocks(stdout);

    if (pems.length === 0) {
      return res.status(502).json({ error: `No certificates found for ${host}:${port}. Ensure the host is reachable.` });
    }

    const chain = assignChainPositions(pems);
    return res.json({ host, port: Number(port), chain });
  } catch (err) {
    if (err.message.includes('timed out')) {
      return res.status(504).json({ error: `Connection to ${host}:${port} timed out.` });
    }
    if (err.code === 'ENOENT') {
      return res.status(500).json({ error: 'openssl is not installed or not in PATH.' });
    }
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

export default router;
