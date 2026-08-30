import ExtractCA from './ExtractCA.jsx';
import CertChain from './CertChain.jsx';
import CertDetails from './CertDetails.jsx';
import styles from './SSLTools.module.css';

export default function SSLTools() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🔐 SSL / OpenSSL Tools</h1>
      <div className={styles.grid}>
        <ExtractCA />
        <CertChain />
        <CertDetails />
      </div>
    </div>
  );
}
