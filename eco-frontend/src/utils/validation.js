// Перевірка значень форми до відправки на сервер за описом полів ресурсу.
// Повертає об'єкт { назва_поля: повідомлення } лише для полів з помилками.
export function validateForm(values, fields) {
  const errors = {};
  for (const f of fields) {
    const raw = (values[f.name] ?? '').trim();
    if (raw === '') {
      if (f.required) errors[f.name] = 'Обов’язкове поле';
      continue;
    }
    if (f.type === 'number') {
      const v = Number(raw);
      if (!Number.isFinite(v)) errors[f.name] = 'Очікується число';
      else if (f.min != null && v < f.min) errors[f.name] = `Не менше ${f.min}`;
      else if (f.max != null && v > f.max) errors[f.name] = `Не більше ${f.max}`;
    } else if (f.type === 'datetime') {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) errors[f.name] = 'Некоректна дата';
      else if (d > new Date()) errors[f.name] = 'Час не може бути в майбутньому';
    } else if (f.maxLength && raw.length > f.maxLength) {
      errors[f.name] = `Не більше ${f.maxLength} символів`;
    }
  }
  return errors;
}
