import { useMemo, useState } from 'react';
import { formatValue } from '../utils/format';
import QualityBadge from './QualityBadge';

// Таблиця даних: стовпці задаються через props, сортування по кліку на заголовок
export default function DataTable({ columns, rows, mainField, getLevel, onView, onEdit, onDelete }) {
  const [sort, setSort] = useState({ field: null, dir: 1 });

  const sorted = useMemo(() => {
    if (!sort.field) return rows;
    return [...rows].sort((a, b) => {
      const x = a[sort.field];
      const y = b[sort.field];
      if (x == null) return 1;
      if (y == null) return -1;
      return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
    });
  }, [rows, sort]);

  const toggleSort = (field) =>
    setSort((s) => (s.field === field ? { field, dir: -s.dir } : { field, dir: 1 }));

  if (rows.length === 0) {
    return <p className="empty">Записів не знайдено</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.name} onClick={() => toggleSort(col.name)} className={col.type === 'number' ? 'num' : ''}>
                {col.label}
                {col.unit && <span className="unit">, {col.unit}</span>}
                {sort.field === col.name && <span className="sort">{sort.dir === 1 ? ' ▲' : ' ▼'}</span>}
              </th>
            ))}
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.name} className={col.type === 'number' ? 'num' : ''}>
                  {formatValue(row[col.name], col.type)}
                  {col.name === mainField && <QualityBadge value={row[col.name]} getLevel={getLevel} />}
                </td>
              ))}
              <td className="actions">
                <button className="btn-icon" onClick={() => onView(row)} title="Переглянути">👁</button>
                <button className="btn-icon" onClick={() => onEdit(row)} title="Редагувати">✎</button>
                <button className="btn-icon danger" onClick={() => onDelete(row)} title="Видалити">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
