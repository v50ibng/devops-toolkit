import styles from './HostPortInput.module.css';

export default function HostPortInput({ host, port, onHostChange, onPortChange }) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label}>Hostname</label>
        <input
          className={styles.input}
          type="text"
          value={host}
          onChange={e => onHostChange(e.target.value)}
          placeholder="e.g. github.com"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div className={styles.portField}>
        <label className={styles.label}>Port</label>
        <input
          className={styles.input}
          type="number"
          value={port}
          onChange={e => onPortChange(e.target.value)}
          min={1}
          max={65535}
          placeholder="443"
        />
      </div>
    </div>
  );
}
