import styles from './Sidebar.module.css';

export default function Sidebar({ tools, active, onSelect, darkMode, onToggleDark }) {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>🔧 DevOps Toolkit</div>
      <ul className={styles.nav}>
        {tools.map(t => (
          <li key={t.id}>
            <button
              className={`${styles.navBtn} ${active === t.id ? styles.active : ''}`}
              onClick={() => onSelect(t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      <button className={styles.darkToggle} onClick={onToggleDark} title="Toggle theme">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </nav>
  );
}
