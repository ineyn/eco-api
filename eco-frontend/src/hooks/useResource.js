import { useCallback, useEffect, useRef, useState } from 'react';
import { isCancel } from 'axios';
import { getErrorMessage } from '../utils/format';

// Кастомний хук: завантаження списку записів ресурсу з фільтрами і пагінацією
// та CRUD-операції з автоматичним оновленням таблиці
export default function useResource(api, { initialLimit = 10 } = {}) {
  const [rows, setRows] = useState([]);
  const [limit, setLimitState] = useState(initialLimit);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: initialLimit });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null); // час останнього успішного завантаження
  const controllerRef = useRef(null); // AbortController поточного запиту

  const load = useCallback(async () => {
    // попередній запит ще виконується — скасувати, щоб його відповідь
    // не перезаписала новішу (швидка зміна фільтрів, сторінок, вкладок)
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      // порожні фільтри не передаються в query
      const params = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res = await api.getAll(params, { signal: controller.signal });
      setRows(res.data);
      setMeta(res.meta);
      setLoadedAt(new Date());
    } catch (err) {
      if (isCancel(err)) return; // запит скасовано навмисно, це не помилка
      setError(getErrorMessage(err));
      setRows([]);
    } finally {
      if (controllerRef.current === controller) setLoading(false);
    }
  }, [api, filters, page, limit]);

  // завантаження при зміні фільтрів або сторінки;
  // при закритті сторінки (перемиканні вкладки) запит скасовується
  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  const applyFilters = (next) => {
    setPage(1);
    setFilters(next);
  };

  const setLimit = (value) => {
    setPage(1);
    setLimitState(value);
  };

  const create = async (body) => {
    const item = await api.create(body);
    await load();
    return item;
  };

  const update = async (id, body) => {
    const item = await api.update(id, body);
    await load();
    return item;
  };

  const remove = async (id) => {
    const item = await api.remove(id);
    // якщо видалено останній запис на сторінці — перейти на попередню
    if (rows.length === 1 && page > 1) setPage(page - 1);
    else await load();
    return item;
  };

  return {
    rows, meta, filters, page, limit, loading, error, loadedAt,
    setPage, setLimit, applyFilters, reload: load, create, update, remove,
  };
}
