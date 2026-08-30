import { useState } from 'react';
import Card from '../ui/Card.jsx';
import CertResult from '../ui/CertResult.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import styles from './CertDetails.module.css';

// Parse a PEM in the browser using basic regex for display
function parseBasicDetails(pem) {
  // We delegate full parsing to backend; this is a lightweight browser-only fallback
  return { raw: pem };
}

export default function CertDetails() {
  const [pem, setPem] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleParse() {
    const trimmed = pem.trim();
    if (!trimmed.includes('-----BEGIN CERTIFICATE-----')) {
      setError('Input does not appear to be a valid PEM certificate.');
      setResult(null);
      return;
    }
    setError(null);
    setResult({ pem: trimmed });
  }

  return (
    <Card title="📄 Display Certificate Details">
      <p className={styles.hint}>Paste a PEM-encoded certificate below:</p>
      <textarea
        className={`${styles.textarea} mono`}
        rows={8}
        value={pem}
        onChange={e => setPem(e.target.value)}
        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
      />
      <button
        className="btn-primary"
        onClick={handleParse}
        disabled={!pem.trim()}
      >
        🔍 Parse
      </button>

      {error && <ErrorMessage message={error} />}
      {result && <CertResult pem={result.pem} label="Certificate Details" browserParse />}
    </Card>
  );
}
