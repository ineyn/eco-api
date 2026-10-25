import { useEffect } from 'react';

// Спливаюче повідомлення про результат операції, зникає через 3 с
export default function Notification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return <div className={`toast toast-${type}`}>{message}</div>;
}
