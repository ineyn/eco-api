// Оцінка рівня показників для кольорового позначення в таблиці

// PM2.5, мкг/м³: категорії індексу якості повітря AQI US EPA (редакція 2024 р.)
export function pm25Level(value) {
  if (value == null) return null;
  if (value <= 9.0) return { level: 'good', label: 'Добра' };
  if (value <= 35.4) return { level: 'moderate', label: 'Помірна' };
  if (value <= 55.4) return { level: 'sensitive', label: 'Шкідлива для чутливих груп' };
  if (value <= 125.4) return { level: 'unhealthy', label: 'Шкідлива' };
  if (value <= 225.4) return { level: 'very', label: 'Дуже шкідлива' };
  return { level: 'hazardous', label: 'Небезпечна' };
}

// pH води: норма для поверхневих вод 6,5–8,5
export function phLevel(value) {
  if (value == null) return null;
  if (value >= 6.5 && value <= 8.5) return { level: 'good', label: 'Норма' };
  if (value >= 6 && value <= 9) return { level: 'moderate', label: 'Відхилення' };
  return { level: 'unhealthy', label: 'Поза нормою' };
}
