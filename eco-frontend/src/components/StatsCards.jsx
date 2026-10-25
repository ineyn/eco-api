import { formatValue } from '../utils/format';
import QualityBadge from './QualityBadge';

// Зведені показники за записами поточної сторінки
export default function StatsCards({ rows, total, field, getLevel }) {
  const values = rows.map((r) => r[field.name]).filter((v) => v != null);
  const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
  const max = values.length ? Math.max(...values) : null;
  const min = values.length ? Math.min(...values) : null;
  const unit = field.unit ? ` ${field.unit}` : '';

  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-label">Усього записів</div>
        <div className="stat-value">{total}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Середнє {field.label} (на сторінці)</div>
        <div className="stat-value">{formatValue(avg, 'number')}<small>{unit}</small></div>
        <QualityBadge value={avg} getLevel={getLevel} />
      </div>
      <div className="stat">
        <div className="stat-label">Мінімум {field.label}</div>
        <div className="stat-value">{formatValue(min, 'number')}<small>{unit}</small></div>
      </div>
      <div className="stat">
        <div className="stat-label">Максимум {field.label}</div>
        <div className="stat-value">{formatValue(max, 'number')}<small>{unit}</small></div>
        <QualityBadge value={max} getLevel={getLevel} />
      </div>
    </div>
  );
}
