function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: 'Помилка валідації', details });
  }

  // некоректний id або тип значення
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Некоректне значення для поля ${err.path}: ${JSON.stringify(err.value)}`,
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Некоректний JSON у тілі запиту' });
  }

  console.error(err);
  res.status(500).json({ success: false, error: 'Внутрішня помилка сервера' });
}

module.exports = errorHandler;
