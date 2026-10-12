# Eco Monitoring API

**КПІ ім. Ігоря Сікорського**
Навчально-науковий інститут атомної та теплової енергетики
Кафедра цифрових технологій в енергетиці

**Дисципліна:** Серверні інформаційні системи екологічного моніторингу
**Лабораторна робота №1:** Створення серверної частини з Express і MongoDB для екологічних даних

**Виконали:** студенти групи ТР-41
- Блонський І. О.
- Семенюта І. В.

**Перевірив:** Рудик В. І.

---

## Опис

REST API для зберігання та обробки екологічних даних: вимірювань якості атмосферного повітря та проб якості води. Підтримуються CRUD-операції, фільтрація та пагінація.

## Технології

- Node.js, Express 5
- MongoDB, Mongoose
- dotenv, helmet, cors
- nodemon (розробка)
- Jest, Supertest (тести)

## Встановлення та запуск

Потрібні Node.js 20+ та запущений MongoDB.

1. Створити файл `.env` у корені проєкту:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ecological_monitoring
MONGO_URI_TEST=mongodb://127.0.0.1:27017/ecological_monitoring_test
```

2. Встановити залежності та запустити:

```
npm install
npm run seed
npm run dev
```

Сервер буде доступний за адресою `http://localhost:3000/api/v1`.

## Скрипти

| Команда | Дія |
|---|---|
| `npm start` | запуск сервера |
| `npm run dev` | запуск з автоперезапуском (nodemon) |
| `npm run seed` | заповнення бази тестовими даними з `data/sample-data.json` |
| `npm test` | автотести (окрема база `MONGO_URI_TEST`) |

## Структура

```
eco-api/
├── data/sample-data.json      тестові дані
├── src/
│   ├── config/                змінні оточення, підключення до БД
│   ├── routes/                маршрути
│   ├── controllers/           обробка запитів і відповідей
│   ├── services/              робота з даними
│   ├── models/                Mongoose-схеми
│   ├── middleware/            обробка помилок
│   ├── utils/                 допоміжні функції
│   ├── app.js                 налаштування Express
│   ├── server.js              точка входу
│   └── seed.js                заповнення бази
└── tests/                     автотести, api.http
```

## API

Базова адреса: `/api/v1`

| Метод | URL | Опис |
|---|---|---|
| GET | `/air-quality` | список вимірювань повітря |
| GET | `/air-quality/:id` | одне вимірювання |
| POST | `/air-quality` | створити вимірювання |
| PUT | `/air-quality/:id` | замінити вимірювання повністю |
| PATCH | `/air-quality/:id` | змінити окремі поля |
| DELETE | `/air-quality/:id` | видалити вимірювання |

Для `/water-quality` набір маршрутів аналогічний.

**Query-параметри для GET списку:** `city`, `station_id`, `from`, `to` (дати), `page`, `limit` (до 100); для води також `water_body`.

Приклад: `GET /api/v1/air-quality?city=Київ&limit=10`

**Формат відповіді:**

```json
{ "success": true, "data": { }, "message": "..." }
{ "success": false, "error": "Помилка валідації", "details": ["..."] }
```

**Коди відповідей:** 200 успіх, 201 створено, 400 некоректні дані або id, 404 не знайдено, 500 помилка сервера.

## Моделі даних

**AirQuality:** `station_id`*, `city`*, `latitude`, `longitude`, `measured_at`, `pm25`*, `pm10`, `no2`, `so2`, `o3`, `co`, `temperature`, `humidity`, `source`

**WaterQuality:** `station_id`*, `water_body`*, `city`, `latitude`, `longitude`, `measured_at`, `ph`*, `dissolved_oxygen`, `turbidity`, `nitrates`, `phosphates`, `temperature`, `source`

\* обов'язкові поля

## Тестування

- Автотести: `npm test` (20 тестів)
- Ручні запити: `tests/api.http` (розширення REST Client для VS Code)
