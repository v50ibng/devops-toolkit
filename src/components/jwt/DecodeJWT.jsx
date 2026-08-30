import { useState } from 'react';
import Card from '../ui/Card.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import styles from './DecodeJWT.module.css';

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function formatExpiry(exp) {
  if (!exp) return null;
  const date = new Date(exp * 1000);
  const now = Date.now();
  const diff = date - now;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const timeStr = date.toLocaleString();
  let relative;
  if (diff > 0) {
    relative = days > 0 ? `in ${days}d ${hours % 24}h` : hours > 0 ? `in ${hours}h ${mins % 60}m` : `in ${mins}m`;
  } else {
    relative = days > 0 ? `${days}d ago (expired)` : hours > 0 ? `${hours}h ago (expired)` : `${mins}m ago (expired)`;
  }
  return `${timeStr} — ${relative}`;
}

export default function DecodeJWT() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleDecode() {
    const trimmed = token.trim();
    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT format. Expected 3 dot-separated parts.');
      setResult(null);
      return;
    }
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    if (!header || !payload) {
      setError('Failed to decode JWT. Make sure the token is valid.');
      setResult(null);
      return;
    }
    setError(null);
    setResult({ header, payload, signature: parts[2] });
  }

  const expiry = result?.payload?.exp ? formatExpiry(result.payload.exp) : null;
  const isExpired = result?.payload?.exp && result.payload.exp * 1000 < Date.now();

  return (
    <Card title="🪙 Decode JWT">
      <p className={styles.hint}>Paste a JWT token to decode its header and payload:</p>
      <textarea
        className={styles.textarea}
        rows={4}
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Paste JWT token here..."
      />
      <button className="btn-primary" onClick={handleDecode} disabled={!token.trim()}>
        🔍 Decode
      </button>

      {error && <ErrorMessage message={error} />}

      {result && (
        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.panelTitle} style={{ color: '#60a5fa' }}>Header</div>
            <pre className={styles.code}>{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelTitle} style={{ color: '#34d399' }}>Payload</div>
            <pre className={styles.code}>{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      )}

      {expiry && (
        <div className={`${styles.expiry} ${isExpired ? styles.expired : styles.valid}`}>
          ⏰ Expires: {expiry}
        </div>
      )}
    </Card>
  );
}
