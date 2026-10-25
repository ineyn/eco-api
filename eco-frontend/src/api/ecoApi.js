import client from './client';

// Набір CRUD-запитів для одного ресурсу API (air-quality або water-quality)
export function createResourceApi(path) {
  return {
    // GET /path?city=...&page=...  -> { data, meta }
    // signal дозволяє скасувати запит, якщо він уже не потрібен
    getAll: (params, { signal } = {}) => client.get(path, { params, signal }).then((res) => res.data),
    getById: (id) => client.get(`${path}/${id}`).then((res) => res.data.data),
    create: (body) => client.post(path, body).then((res) => res.data.data),
    replace: (id, body) => client.put(`${path}/${id}`, body).then((res) => res.data.data),
    update: (id, body) => client.patch(`${path}/${id}`, body).then((res) => res.data.data),
    remove: (id) => client.delete(`${path}/${id}`).then((res) => res.data.data),
  };
}

export const airQualityApi = createResourceApi('/air-quality');
export const waterQualityApi = createResourceApi('/water-quality');

// Перевірка доступності сервера (GET /api/v1)
export const checkApi = () => client.get('/').then((res) => res.data);
