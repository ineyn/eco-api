require('./config/env');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecological_monitoring';

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущено: http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.error('Не вдалося підключитися до MongoDB:', err.message);
    process.exit(1);
  });
