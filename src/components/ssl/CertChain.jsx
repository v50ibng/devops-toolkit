import { useState } from 'react';
import Card from '../ui/Card.jsx';
import HostPortInput from '../ui/HostPortInput.jsx';
import CertResult from '../ui/CertResult.jsx';
import Spinner from '../ui/Spinner.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import styles from './CertChain.module.css';

import { API_BASE } from '../../config.js';

const POSITION_COLORS = {
  Root: '#10b981',
  Intermediate: '#f59e0b',
  Leaf: '#3b82f6',
};

export default function CertChain() {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('443');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState({});

  async function handleFetch() {
    setLoading(true);
    setError(null);
    setResult(null);
    setExpanded({});
    try {
      const res = await fetch(`${API_BASE}/api/ssl/cert-chain`, {
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

  function toggleExpand(i) {
    setExpanded(e => ({ ...e, [i]: !e[i] }));
  }

  return (
    <Card title="🔗 Show Certificate Chain">
      <HostPortInput host={host} port={port} onHostChange={setHost} onPortChange={setPort} />
      <button
        className="btn-primary"
        onClick={handleFetch}
        disabled={loading || !host.trim()}
      >
        {loading ? <Spinner /> : '🔍 Fetch Chain'}
      </button>

      {error && <ErrorMessage message={error} />}

      {result && (
        <div className={styles.chain}>
          {result.chain.map((cert, i) => (
            <div key={i} className={styles.chainItem}>
              <div
                className={styles.chainHeader}
                style={{ borderLeftColor: POSITION_COLORS[cert.position] || '#6b7280' }}
              >
                <span
                  className={styles.badge}
                  style={{ background: POSITION_COLORS[cert.position] || '#6b7280' }}
                >
                  {cert.position}
                </span>
                <span className={styles.subject}>{cert.details?.subject || 'Unknown'}</span>
                <button className={styles.expandBtn} onClick={() => toggleExpand(i)}>
                  {expanded[i] ? '▲ Hide' : '▼ Details'}
                </button>
              </div>
              {expanded[i] && (
                <CertResult pem={cert.pem} details={cert.details} label={cert.position} />
              )}
              {i < result.chain.length - 1 && <div className={styles.connector}>│</div>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
