// Допоміжні функції для обробки query-параметрів

// Екранування спецсимволів в RegExp
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Фільтр "точний збіг без урахування регістру"
function exactIgnoreCase(str) {
  return { $regex: `^${escapeRegex(str)}$`, $options: 'i' };
}

// limit сторінок від 1 до 100 (за замовчуванням 50), page від 1
function parsePagination(query) {
  const limit = Math.min(parseInt(query.limit) || 50, 100);
  const page = Math.max(parseInt(query.page) || 1, 1);
  return { limit, page, skip: (page - 1) * limit };
}

// Фільтр за діапазоном дат measured_at
function dateRange(from, to) {
  if (!from && !to) return null;
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return range;
}

module.exports = { escapeRegex, exactIgnoreCase, parsePagination, dateRange };
