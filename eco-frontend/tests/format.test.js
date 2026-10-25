import { describe, expect, test } from 'vitest';
import { buildCreatePayload, buildPatchPayload, getErrorMessage, toFormValues } from '../src/utils/format';
import { pm25Level, phLevel } from '../src/utils/quality';

const fields = [
  { name: 'station_id', type: 'text' },
  { name: 'pm25', type: 'number' },
  { name: 'pm10', type: 'number' },
];

describe('підготовка даних форми', () => {
  test('POST: рядки перетворюються в числа, порожні поля не передаються', () => {
    const body = buildCreatePayload({ station_id: ' KYIV_001 ', pm25: '12.5', pm10: '' }, fields);
    expect(body).toEqual({ station_id: 'KYIV_001', pm25: 12.5 });
  });

  test('PATCH: передаються лише змінені поля, очищене поле - null', () => {
    const initial = toFormValues({ station_id: 'A', pm25: 10, pm10: 20 }, fields);
    const body = buildPatchPayload({ ...initial, pm25: '15', pm10: '' }, initial, fields);
    expect(body).toEqual({ pm25: 15, pm10: null });
  });

  test('текст помилки валідації з відповіді сервера', () => {
    const err = { response: { status: 400, data: { error: 'Помилка валідації', details: ['a', 'b'] } } };
    expect(getErrorMessage(err)).toBe('Помилка валідації: a; b');
  });

  test('повідомлення, якщо сервер недоступний', () => {
    expect(getErrorMessage({ request: {} })).toMatch(/недоступний/);
  });
});

describe('оцінка рівня показників', () => {
  test('PM2.5 за шкалою AQI US EPA', () => {
    expect(pm25Level(9.0).level).toBe('good');
    expect(pm25Level(12.4).level).toBe('moderate');
    expect(pm25Level(44).level).toBe('sensitive');
    expect(pm25Level(80).level).toBe('unhealthy');
    expect(pm25Level(200).level).toBe('very');
    expect(pm25Level(300).level).toBe('hazardous');
    expect(pm25Level(null)).toBeNull();
  });

  test('pH', () => {
    expect(phLevel(7.4).level).toBe('good');
    expect(phLevel(8.8).level).toBe('moderate');
    expect(phLevel(10).level).toBe('unhealthy');
  });
});
