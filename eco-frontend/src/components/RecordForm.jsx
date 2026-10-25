import { useState } from 'react';
import { toFormValues } from '../utils/format';
import { validateForm } from '../utils/validation';

// Форма створення / редагування запису. Поля будуються з опису ресурсу.
// Перед відправкою значення перевіряються, поля з помилками підсвічуються.
export default function RecordForm({ fields, record, onSubmit, onCancel }) {
  const initial = toFormValues(record, fields);
  const [values, setValues] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null); // помилка від сервера
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // помилка поля зникає, щойно користувач його виправляє
    if (fieldErrors[name]) {
      const { [name]: _, ...rest } = fieldErrors;
      setFieldErrors(rest);
    }
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const errors = validateForm(values, fields);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return; // некоректні дані на сервер не відправляються

    setSaving(true);
    setError(null);
    try {
      await onSubmit(values, initial);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="record-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        {fields.map((f) => {
          const invalid = Boolean(fieldErrors[f.name]);
          return (
            <label key={f.name} className={invalid ? 'invalid' : ''}>
              <span>
                {f.label}
                {f.unit && `, ${f.unit}`}
                {f.required && <b className="req"> *</b>}
              </span>
              {f.type === 'select' ? (
                <select name={f.name} value={values[f.name]} onChange={change}>
                  <option value="">— за замовчуванням —</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  name={f.name}
                  type={f.type === 'number' ? 'number' : f.type === 'datetime' ? 'datetime-local' : 'text'}
                  step="any"
                  value={values[f.name]}
                  onChange={change}
                  aria-invalid={invalid}
                />
              )}
              {invalid && <small className="field-error">{fieldErrors[f.name]}</small>}
            </label>
          );
        })}
      </div>
      {Object.keys(fieldErrors).length > 0 && (
        <div className="alert alert-error">Виправте виділені поля</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-buttons">
        <button type="button" className="btn" onClick={onCancel}>Скасувати</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Збереження…' : record ? 'Зберегти зміни' : 'Створити'}
        </button>
      </div>
    </form>
  );
}
