require('../src/config/env');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

const TEST_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/ecological_monitoring_test';

beforeAll(async () => {
  await mongoose.connect(TEST_URI, { serverSelectionTimeoutMS: 10000 });
  await mongoose.connection.db.dropDatabase();
}, 20000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('AirQuality API', () => {
  let id;

  test('POST створює вимірювання - 201', async () => {
    const res = await request(app)
      .post('/api/v1/air-quality')
      .send({ station_id: 'TEST_001', city: 'Київ', pm25: 20.5, pm10: 30 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.source).toBe('manual');
    id = res.body.data._id;
  });

  test('POST без обов\'язкових полів - 400', async () => {
    const res = await request(app).post('/api/v1/air-quality').send({ city: 'Київ' }).expect(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  test('POST з від\'ємним pm25 - 400', async () => {
    await request(app)
      .post('/api/v1/air-quality')
      .send({ station_id: 'TEST_001', city: 'Київ', pm25: -5 })
      .expect(400);
  });

  test('GET усі - 200 і масив', async () => {
    const res = await request(app).get('/api/v1/air-quality').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.total).toBe(1);
  });

  test('GET з фільтром city=львів - 0 записів', async () => {
    const res = await request(app).get('/api/v1/air-quality?city=львів').expect(200);
    expect(res.body.data).toHaveLength(0);
  });

  test('GET за id - 200', async () => {
    const res = await request(app).get(`/api/v1/air-quality/${id}`).expect(200);
    expect(res.body.data.station_id).toBe('TEST_001');
  });

  test('GET неіснуючого id - 404', async () => {
    await request(app).get(`/api/v1/air-quality/${new mongoose.Types.ObjectId()}`).expect(404);
  });

  test('GET з некоректним id - 400', async () => {
    await request(app).get('/api/v1/air-quality/abc').expect(400);
  });

  test('PATCH змінює лише передане поле - 200', async () => {
    const res = await request(app).patch(`/api/v1/air-quality/${id}`).send({ pm25: 33.3 }).expect(200);
    expect(res.body.data.pm25).toBe(33.3);
    expect(res.body.data.pm10).toBe(30);
  });

  test('PUT повністю замінює документ - 200', async () => {
    const res = await request(app)
      .put(`/api/v1/air-quality/${id}`)
      .send({ station_id: 'TEST_002', city: 'Львів', pm25: 10 })
      .expect(200);
    expect(res.body.data.city).toBe('Львів');
    expect(res.body.data.pm10).toBeUndefined();
  });

  test('DELETE видаляє - 200, потім GET - 404', async () => {
    await request(app).delete(`/api/v1/air-quality/${id}`).expect(200);
    await request(app).get(`/api/v1/air-quality/${id}`).expect(404);
  });
});
