const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const airQualityRoutes = require('./routes/airQualityRoutes');
const waterQualityRoutes = require('./routes/waterQualityRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// логування запитів
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Eco Monitoring API працює',
    endpoints: ['/api/v1/air-quality', '/api/v1/water-quality'],
  });
});

app.use('/api/v1/air-quality', airQualityRoutes);
app.use('/api/v1/water-quality', waterQualityRoutes);

// 404 для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Маршрут ${req.method} ${req.originalUrl} не існує` });
});

app.use(errorHandler);

module.exports = app;
