import { formatValue } from '../utils/format';

// Перегляд усіх полів одного запису (дані з GET /:id)
export default function RecordDetails({ fields, record }) {
  return (
    <dl className="details">
      <dt>_id</dt>
      <dd><code>{record._id}</code></dd>
      {fields.map((f) => (
        <div key={f.name} className="details-row">
          <dt>{f.label}{f.unit && `, ${f.unit}`}</dt>
          <dd>{formatValue(record[f.name], f.type)}</dd>
        </div>
      ))}
      <dt>Створено</dt>
      <dd>{formatValue(record.createdAt, 'datetime')}</dd>
      <dt>Оновлено</dt>
      <dd>{formatValue(record.updatedAt, 'datetime')}</dd>
    </dl>
  );
}
