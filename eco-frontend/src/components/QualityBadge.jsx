// Кольорова мітка рівня показника
export default function QualityBadge({ value, getLevel }) {
  const q = getLevel(value);
  if (!q) return null;
  return <span className={`badge badge-${q.level}`} title={q.label}>{q.label}</span>;
}
