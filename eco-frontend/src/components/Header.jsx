import { useEffect, useState } from 'react';
import { checkApi } from '../api/ecoApi';
import { API_URL } from '../api/client';

// Шапка з індикатором доступності API
export default function Header() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    checkApi().then(() => setOnline(true)).catch(() => setOnline(false));
  }, []);

  return (
    <header className="header">
      <div className="brand">
        <span className="logo">🌿</span>
        <div>
          <h1>Eco Monitoring</h1>
          <p>Система екологічного моніторингу якості повітря та води</p>
        </div>
      </div>
      <div className={`api-status ${online ? 'on' : online === false ? 'off' : ''}`}>
        <span className="dot" />
        {online === null ? 'Перевірка API…' : online ? 'API підключено' : 'API недоступне'}
        <code>{API_URL}</code>
      </div>
    </header>
  );
}
