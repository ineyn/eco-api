// Заповнення бази тестовими даними з data/sample-data.json
require('./config/env');
const mongoose = require('mongoose');
const AirQuality = require('./models/AirQuality');
const WaterQuality = require('./models/WaterQuality');
const sampleData = require('../data/sample-data.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecological_monitoring';

async function seed() {
  await mongoose.connect(MONGO_URI);
  await AirQuality.deleteMany({});
  await WaterQuality.deleteMany({});
  const a = await AirQuality.insertMany(sampleData.airQuality);
  const w = await WaterQuality.insertMany(sampleData.waterQuality);
  console.log(`Додано записів: якість повітря: ${a.length}, якість води: ${w.length}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Помилка заповнення бази:', err.message);
  process.exit(1);
});
