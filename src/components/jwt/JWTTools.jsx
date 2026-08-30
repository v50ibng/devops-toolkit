import DecodeJWT from './DecodeJWT.jsx';
import styles from './JWTTools.module.css';

export default function JWTTools() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🪙 JWT Tools</h1>
      <div className={styles.grid}>
        <DecodeJWT />
      </div>
    </div>
  );
}
