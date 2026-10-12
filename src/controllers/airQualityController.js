const service = require('../services/airQualityService');
const { parsePagination } = require('../utils/query');

async function getAll(req, res) {
  const { limit, page, skip } = parsePagination(req.query);
  const { data, total } = await service.getAll(req.query, { limit, skip });

  res.status(200).json({
    success: true,
    data,
    meta: { count: data.length, total, page, limit },
  });
}

async function getById(req, res) {
  const item = await service.getById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
  }
  res.status(200).json({ success: true, data: item });
}

async function create(req, res) {
  const item = await service.create(req.body);
  res.status(201).json({ success: true, message: 'Вимірювання створено', data: item });
}

// PUT - повна заміна документа
async function replace(req, res) {
  const { _id, ...body } = req.body;
  const item = await service.replace(req.params.id, body);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
  }
  res.status(200).json({ success: true, message: 'Вимірювання замінено', data: item });
}

// PATCH - оновлення окремих полів
async function update(req, res) {
  const { _id, ...body } = req.body;
  const item = await service.update(req.params.id, body);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
  }
  res.status(200).json({ success: true, message: 'Вимірювання оновлено', data: item });
}

async function remove(req, res) {
  const item = await service.remove(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
  }
  res.status(200).json({ success: true, message: 'Вимірювання видалено', data: item });
}

module.exports = { getAll, getById, create, replace, update, remove };
