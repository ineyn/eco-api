const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema(
  {
    station_id: {
      type: String,
      required: [true, "Поле station_id обов'язкове"],
      trim: true,
    },
    water_body: {
      type: String,
      required: [true, "Поле water_body обов'язкове"],
      trim: true,
    },
    city: { type: String, trim: true, maxlength: 50 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    measured_at: { type: Date, default: Date.now },

    ph: {
      type: Number,
      required: [true, "Поле ph обов'язкове"],
      min: [0, 'pH не може бути меншим за 0'],
      max: [14, 'pH не може бути більшим за 14'],
    },
    dissolved_oxygen: { type: Number, min: 0 }, // мг/л
    turbidity: { type: Number, min: 0 }, // NTU
    nitrates: { type: Number, min: 0 }, // мг/л
    phosphates: { type: Number, min: 0 }, // мг/л
    temperature: { type: Number, min: -5, max: 50 },

    source: {
      type: String,
      enum: ['Держводагентство', 'data.gov.ua', 'Водоканал', 'manual'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
