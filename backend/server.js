const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./config/logger");
require("./config/env"); // ✅ Carga y valida las variables de entorno
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "uploads");  // mismo que en multer

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  logger.info("📂  Carpeta 'uploads/' creada automáticamente");
}


const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------------- Middlewares globales -------------------------- */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // si usas cookies o auth headers, opcional
}));

app.use(helmet());
app.use(express.json());
app.use(morgan("dev")); // Cambia a 'combined' en producción si deseas logs detallados

/* --------------------------- Rutas estáticas ------------------------------- */
app.use("/imagenes", express.static(path.join(__dirname, "..", "docs", "casos_uso")));

/* --------------------------- Rutas dinámicas ------------------------------- */
const routes = require("./routes"); // Cargará automáticamente routes/index.js
app.use("/api", routes);

/* --------------------------- 404 y errores globales ------------------------ */
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorHandler); // Middleware centralizado para errores

/* --------------------------- Iniciar servidor ------------------------------ */
app.listen(PORT, () => {
  logger.info(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
