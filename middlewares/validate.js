module.exports = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    });
    next();
  } catch (err) {
    err.statusCode = 400;
    err.message = "Validation error";
    err.details = err.errors;
    next(err);
  }
};
