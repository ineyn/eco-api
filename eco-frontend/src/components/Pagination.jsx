// Перемикання сторінок за даними meta з відповіді API
export default function Pagination({ page, limit, total, onChange, onLimitChange }) {
  const pages = Math.max(Math.ceil(total / limit), 1);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="pagination">
      <span>
        Показано {from}–{to} з {total}
        <select className="limit" value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
          {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n} на сторінці</option>)}
        </select>
      </span>
      <div>
        <button className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Назад</button>
        <span className="page-num">Сторінка {page} з {pages}</span>
        <button className="btn" disabled={page >= pages} onClick={() => onChange(page + 1)}>Далі →</button>
      </div>
    </div>
  );
}
