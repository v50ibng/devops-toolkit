import { useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import SSLTools from './components/ssl/SSLTools.jsx';
import JWTTools from './components/jwt/JWTTools.jsx';
import styles from './App.module.css';

const TOOLS = [
  { id: 'ssl', label: '🔐 SSL Tools' },
  { id: 'jwt', label: '🪙 JWT Tools' },
];

export default function App() {
  const [active, setActive] = useState('ssl');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : styles.light}`}>
      <Sidebar tools={TOOLS} active={active} onSelect={setActive} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <main className={styles.main}>
        {active === 'ssl' && <SSLTools />}
        {active === 'jwt' && <JWTTools />}
      </main>
    </div>
  );
}
