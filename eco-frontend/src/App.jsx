import { useState } from 'react';
import Header from './components/Header';
import ResourcePage from './pages/ResourcePage';
import { resources } from './config/resources';

export default function App() {
  const [tab, setTab] = useState('air');

  return (
    <div className="app">
      <Header />
      <nav className="tabs">
        {Object.values(resources).map((r) => (
          <button key={r.key} className={tab === r.key ? 'tab active' : 'tab'} onClick={() => setTab(r.key)}>
            {r.title}
          </button>
        ))}
      </nav>
      <main>
        {/* key скидає стан сторінки при перемиканні вкладки */}
        <ResourcePage key={tab} resource={resources[tab]} />
      </main>
    </div>
  );
}
