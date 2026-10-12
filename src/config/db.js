const mongoose = require('mongoose');

async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log(`MongoDB підключено: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDB;
