import { useState } from 'react';
import styles from './CertResult.module.css';

export default function CertResult({ pem, details, label, browserParse }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(pem).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([pem], { type: 'application/x-pem-file' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(label || 'cert').replace(/\s+/g, '_').toLowerCase()}.pem`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.result}>
      {label && <div className={styles.label}>{label}</div>}
      <pre className={styles.pem}>{pem}</pre>
      <div className={styles.actions}>
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
        <button className="btn-secondary" onClick={handleDownload}>
          ⬇️ Download
        </button>
      </div>

      {details && !details.error && !browserParse && (
        <div className={styles.details}>
          <div className={styles.detailTitle}>📊 Parsed Details</div>
          <table className={styles.table}>
            <tbody>
              {details.subject && <tr><td className={styles.key}>Subject</td><td className={styles.val}>{details.subject}</td></tr>}
              {details.issuer && <tr><td className={styles.key}>Issuer</td><td className={styles.val}>{details.issuer}</td></tr>}
              {details.notBefore && <tr><td className={styles.key}>Valid From</td><td className={styles.val}>{details.notBefore}</td></tr>}
              {details.notAfter && <tr><td className={styles.key}>Valid Until</td><td className={styles.val}>{details.notAfter}</td></tr>}
              {details.sans && details.sans.length > 0 && (
                <tr><td className={styles.key}>SANs</td><td className={styles.val}>{details.sans.join(', ')}</td></tr>
              )}
              {details.fingerprint && <tr><td className={styles.key}>SHA-256</td><td className={styles.val}>{details.fingerprint}</td></tr>}
              {details.serialNumber && <tr><td className={styles.key}>Serial</td><td className={styles.val}>{details.serialNumber}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {details && details.error && (
        <p className={styles.parseError}>⚠️ Could not parse certificate details: {details.error}</p>
      )}

      {browserParse && (
        <div className={styles.details}>
          <div className={styles.detailTitle}>📄 PEM Preview</div>
          <p className={styles.hint}>For full parsed details, use the Extract CA or Cert Chain tools with a hostname.</p>
        </div>
      )}
    </div>
  );
}
