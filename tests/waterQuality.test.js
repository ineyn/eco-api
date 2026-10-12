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

describe('WaterQuality API', () => {
  let id;

  test('POST створює пробу - 201', async () => {
    const res = await request(app)
      .post('/api/v1/water-quality')
      .send({ station_id: 'W_TEST_01', water_body: 'Дніпро', city: 'Київ', ph: 7.6, nitrates: 2.1 })
      .expect(201);
    expect(res.body.success).toBe(true);
    id = res.body.data._id;
  });

  test('POST з pH > 14 - 400', async () => {
    const res = await request(app)
      .post('/api/v1/water-quality')
      .send({ station_id: 'W_TEST_01', water_body: 'Дніпро', ph: 15 })
      .expect(400);
    expect(res.body.details[0]).toMatch(/pH/);
  });

  test('POST без water_body - 400', async () => {
    await request(app).post('/api/v1/water-quality').send({ station_id: 'X', ph: 7 }).expect(400);
  });

  test('GET усі з фільтром water_body=дніпро - 1 запис', async () => {
    const res = await request(app).get('/api/v1/water-quality?water_body=дніпро').expect(200);
    expect(res.body.data).toHaveLength(1);
  });

  test('GET за id - 200', async () => {
    const res = await request(app).get(`/api/v1/water-quality/${id}`).expect(200);
    expect(res.body.data.water_body).toBe('Дніпро');
  });

  test('PATCH - 200', async () => {
    const res = await request(app).patch(`/api/v1/water-quality/${id}`).send({ ph: 8.2 }).expect(200);
    expect(res.body.data.ph).toBe(8.2);
  });

  test('PATCH з невалідним pH - 400', async () => {
    await request(app).patch(`/api/v1/water-quality/${id}`).send({ ph: -1 }).expect(400);
  });

  test('PUT - 200', async () => {
    const res = await request(app)
      .put(`/api/v1/water-quality/${id}`)
      .send({ station_id: 'W_TEST_02', water_body: 'Десна', ph: 7.0 })
      .expect(200);
    expect(res.body.data.water_body).toBe('Десна');
    expect(res.body.data.nitrates).toBeUndefined();
  });

  test('DELETE - 200, повторний DELETE - 404', async () => {
    await request(app).delete(`/api/v1/water-quality/${id}`).expect(200);
    await request(app).delete(`/api/v1/water-quality/${id}`).expect(404);
  });
});
