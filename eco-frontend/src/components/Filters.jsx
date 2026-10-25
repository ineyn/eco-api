import { useState } from 'react';

// Панель фільтрів: передає значення в query-параметри GET-запиту
export default function Filters({ fields, onApply }) {
  const empty = Object.fromEntries([...fields.map((f) => [f.name, '']), ['from', ''], ['to', '']]);
  const [values, setValues] = useState(empty);

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onApply({
      ...values,
      from: values.from && new Date(values.from).toISOString(),
      to: values.to && new Date(values.to).toISOString(),
    });
  };

  const reset = () => {
    setValues(empty);
    onApply({});
  };

  return (
    <form className="filters" onSubmit={submit}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          <input name={f.name} value={values[f.name]} onChange={change} placeholder="усі" />
        </label>
      ))}
      <label>
        Від
        <input type="datetime-local" name="from" value={values.from} onChange={change} />
      </label>
      <label>
        До
        <input type="datetime-local" name="to" value={values.to} onChange={change} />
      </label>
      <div className="filters-buttons">
        <button type="submit" className="btn btn-primary">Знайти</button>
        <button type="button" className="btn" onClick={reset}>Скинути</button>
      </div>
    </form>
  );
}
