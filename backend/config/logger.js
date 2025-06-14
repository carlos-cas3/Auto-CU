const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Muestra en terminal
        new transports.File({ filename: "logs/app.log" }), // Guarda en archivo
        new transports.File({ filename: "logs/error.log", level: "error" }), // Solo errores
    ],
});

module.exports = logger;
