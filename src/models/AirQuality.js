const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema(
  {
    station_id: {
      type: String,
      required: [true, "Поле station_id обов'язкове"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Поле city обов'язкове"],
      trim: true,
      maxlength: 50,
    },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    measured_at: { type: Date, default: Date.now },

    // концентрації, мкг/м3
    pm25: {
      type: Number,
      required: [true, "Поле pm25 обов'язкове"],
      min: [0, "pm25 не може бути від'ємним"],
    },
    pm10: { type: Number, min: 0 },
    no2: { type: Number, min: 0 },
    so2: { type: Number, min: 0 },
    o3: { type: Number, min: 0 },
    co: { type: Number, min: 0 },

    temperature: { type: Number, min: -60, max: 60 },
    humidity: { type: Number, min: 0, max: 100 },

    source: {
      type: String,
      enum: ['SaveEcoBot', 'OpenAQ', 'EcoCity', 'manual'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AirQuality', airQualitySchema);
