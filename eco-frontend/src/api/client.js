import axios from 'axios';

// Базова адреса API з ЛР1 (задається у файлі .env)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const client = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default client;
