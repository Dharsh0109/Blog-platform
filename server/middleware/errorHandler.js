const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Mongoose bad ObjectId
  if (err.name === 'CastError')
    return res.status(400).json({ message: 'Invalid ID format' });

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already in use` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  res.status(status).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
