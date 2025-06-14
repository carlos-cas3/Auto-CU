const logger = require("../config/logger");

function errorHandler(err, _req, res, _next) {
  logger.error(err);                     // log completo
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Error interno del servidor",
    stack:   process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = errorHandler;
