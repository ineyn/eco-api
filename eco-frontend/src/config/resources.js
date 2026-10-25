import { airQualityApi, waterQualityApi } from '../api/ecoApi';
import { pm25Level, phLevel } from '../utils/quality';

// Опис ресурсів: поля відповідають моделям AirQuality та WaterQuality з ЛР1.
// За цим описом будуються стовпці таблиці, форма та фільтри.
export const resources = {
  air: {
    key: 'air',
    title: 'Якість повітря',
    api: airQualityApi,
    mainField: 'pm25',
    quality: pm25Level,
    fields: [
      { name: 'station_id', label: 'Станція', type: 'text', required: true, inTable: true },
      { name: 'city', label: 'Місто', type: 'text', required: true, maxLength: 50, inTable: true },
      { name: 'measured_at', label: 'Час вимірювання', type: 'datetime', inTable: true },
      { name: 'pm25', label: 'PM2.5', unit: 'мкг/м³', type: 'number', required: true, min: 0, inTable: true },
      { name: 'pm10', label: 'PM10', unit: 'мкг/м³', type: 'number', min: 0, inTable: true },
      { name: 'no2', label: 'NO₂', unit: 'мкг/м³', type: 'number', min: 0, inTable: true },
      { name: 'so2', label: 'SO₂', unit: 'мкг/м³', type: 'number', min: 0 },
      { name: 'o3', label: 'O₃', unit: 'мкг/м³', type: 'number', min: 0 },
      { name: 'co', label: 'CO', unit: 'мг/м³', type: 'number', min: 0 },
      { name: 'temperature', label: 'Температура', unit: '°C', type: 'number', min: -60, max: 60, inTable: true },
      { name: 'humidity', label: 'Вологість', unit: '%', type: 'number', min: 0, max: 100, inTable: true },
      { name: 'latitude', label: 'Широта', type: 'number', min: -90, max: 90 },
      { name: 'longitude', label: 'Довгота', type: 'number', min: -180, max: 180 },
      { name: 'source', label: 'Джерело', type: 'select', options: ['SaveEcoBot', 'OpenAQ', 'EcoCity', 'manual'], inTable: true },
    ],
    filters: ['city', 'station_id'],
  },
  water: {
    key: 'water',
    title: 'Якість води',
    api: waterQualityApi,
    mainField: 'ph',
    quality: phLevel,
    fields: [
      { name: 'station_id', label: 'Пункт', type: 'text', required: true, inTable: true },
      { name: 'water_body', label: 'Водний об’єкт', type: 'text', required: true, inTable: true },
      { name: 'city', label: 'Населений пункт', type: 'text', maxLength: 50 },
      { name: 'measured_at', label: 'Час відбору', type: 'datetime', inTable: true },
      { name: 'ph', label: 'pH', type: 'number', required: true, min: 0, max: 14, inTable: true },
      { name: 'dissolved_oxygen', label: 'Розч. кисень', unit: 'мг/л', type: 'number', min: 0, inTable: true },
      { name: 'turbidity', label: 'Каламутність', unit: 'NTU', type: 'number', min: 0, inTable: true },
      { name: 'nitrates', label: 'Нітрати', unit: 'мг/л', type: 'number', min: 0, inTable: true },
      { name: 'phosphates', label: 'Фосфати', unit: 'мг/л', type: 'number', min: 0 },
      { name: 'temperature', label: 'Температура', unit: '°C', type: 'number', min: -5, max: 50 },
      { name: 'latitude', label: 'Широта', type: 'number', min: -90, max: 90 },
      { name: 'longitude', label: 'Довгота', type: 'number', min: -180, max: 180 },
      { name: 'source', label: 'Джерело', type: 'select', options: ['Держводагентство', 'data.gov.ua', 'Водоканал', 'manual'], inTable: true },
    ],
    filters: ['water_body', 'city', 'station_id'],
  },
};
