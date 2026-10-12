// Робота з даними якості води (без req/res)
const WaterQuality = require('../models/WaterQuality');
const { exactIgnoreCase, dateRange } = require('../utils/query');

async function getAll({ city, water_body, station_id, from, to }, { limit, skip }) {
  const filter = {};
  if (city) filter.city = exactIgnoreCase(city);
  if (water_body) filter.water_body = exactIgnoreCase(water_body);
  if (station_id) filter.station_id = station_id;
  const range = dateRange(from, to);
  if (range) filter.measured_at = range;

  const [data, total] = await Promise.all([
    WaterQuality.find(filter).sort({ measured_at: -1 }).skip(skip).limit(limit),
    WaterQuality.countDocuments(filter),
  ]);
  return { data, total };
}

function getById(id) {
  return WaterQuality.findById(id);
}

function create(data) {
  return WaterQuality.create(data);
}

// повна заміна документа
function replace(id, data) {
  return WaterQuality.findOneAndReplace({ _id: id }, data, {
    returnDocument: 'after',
    runValidators: true,
  });
}

// оновлення окремих полів
function update(id, data) {
  return WaterQuality.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
}

function remove(id) {
  return WaterQuality.findByIdAndDelete(id);
}

module.exports = { getAll, getById, create, replace, update, remove };
