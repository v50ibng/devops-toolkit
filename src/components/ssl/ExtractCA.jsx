import { useState } from 'react';
import Card from '../ui/Card.jsx';
import HostPortInput from '../ui/HostPortInput.jsx';
import CertResult from '../ui/CertResult.jsx';
import Spinner from '../ui/Spinner.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

import { API_BASE } from '../../config.js';

export default function ExtractCA() {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('443');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleExtract() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ssl/extract-ca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: host.trim(), port: Number(port) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed');
      } else {
        setResult(data);
      }
    } catch {
      setError('Backend server is unreachable. In development, run: cd server && npm start');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="🔑 Extract CA from Host">
      <HostPortInput host={host} port={port} onHostChange={setHost} onPortChange={setPort} />
      <button
        className="btn-primary"
        onClick={handleExtract}
        disabled={loading || !host.trim()}
      >
        {loading ? <Spinner /> : '🔍 Extract'}
      </button>

      {error && <ErrorMessage message={error} />}

      {result && result.certs.map((c, i) => (
        <CertResult key={i} pem={c.pem} details={c.details} label={`CA Certificate ${i + 1}`} />
      ))}
    </Card>
  );
}
