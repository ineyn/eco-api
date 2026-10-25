// Форматування значень для відображення та підготовка даних форми

export function formatValue(value, type) {
  if (value === null || value === undefined || value === '') return '—';
  if (type === 'datetime') {
    return new Date(value).toLocaleString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }
  if (type === 'number') return Number(value).toLocaleString('uk-UA', { maximumFractionDigits: 2 });
  return String(value);
}

// Дата з API (ISO) -> значення для <input type="datetime-local">
export function toDateTimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Запис з API -> початкові значення форми (усі значення рядками)
export function toFormValues(record, fields) {
  const values = {};
  for (const f of fields) {
    const v = record?.[f.name];
    if (f.type === 'datetime') values[f.name] = toDateTimeLocal(v);
    else values[f.name] = v === null || v === undefined ? '' : String(v);
  }
  return values;
}

// Значення одного поля форми -> значення для API
function parseField(field, raw) {
  if (raw === '') return null;
  if (field.type === 'number') return Number(raw);
  if (field.type === 'datetime') return new Date(raw).toISOString();
  return raw.trim();
}

// Тіло POST-запиту: порожні поля не передаються (сервер підставить значення за замовчуванням)
export function buildCreatePayload(values, fields) {
  const body = {};
  for (const f of fields) {
    const v = parseField(f, values[f.name] ?? '');
    if (v !== null) body[f.name] = v;
  }
  return body;
}

// Тіло PATCH-запиту: лише змінені поля; очищене поле передається як null
export function buildPatchPayload(values, initial, fields) {
  const body = {};
  for (const f of fields) {
    if ((values[f.name] ?? '') !== (initial[f.name] ?? '')) {
      body[f.name] = parseField(f, values[f.name] ?? '');
    }
  }
  return body;
}

// Текст помилки з відповіді сервера (формат ЛР1: { error, details })
export function getErrorMessage(err) {
  if (err.response?.data) {
    const { error, details } = err.response.data;
    return details?.length ? `${error}: ${details.join('; ')}` : error || `Помилка ${err.response.status}`;
  }
  if (err.request) return 'Сервер API недоступний. Перевірте, чи запущено eco-api (npm run dev).';
  return err.message;
}
