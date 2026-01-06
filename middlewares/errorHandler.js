module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  const payload = {
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
    payload.name = err.name;
  }

  res.status(status).json(payload);
};
