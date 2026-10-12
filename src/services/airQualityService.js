// Робота з даними якості повітря (без req/res)
const AirQuality = require('../models/AirQuality');
const { exactIgnoreCase, dateRange } = require('../utils/query');

async function getAll({ city, station_id, from, to }, { limit, skip }) {
  const filter = {};
  if (city) filter.city = exactIgnoreCase(city);
  if (station_id) filter.station_id = station_id;
  const range = dateRange(from, to);
  if (range) filter.measured_at = range;

  const [data, total] = await Promise.all([
    AirQuality.find(filter).sort({ measured_at: -1 }).skip(skip).limit(limit),
    AirQuality.countDocuments(filter),
  ]);
  return { data, total };
}

function getById(id) {
  return AirQuality.findById(id);
}

function create(data) {
  return AirQuality.create(data);
}

// повна заміна документа
function replace(id, data) {
  return AirQuality.findOneAndReplace({ _id: id }, data, {
    returnDocument: 'after',
    runValidators: true,
  });
}

// оновлення окремих полів
function update(id, data) {
  return AirQuality.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
}

function remove(id) {
  return AirQuality.findByIdAndDelete(id);
}

module.exports = { getAll, getById, create, replace, update, remove };
