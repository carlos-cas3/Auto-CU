const logger = require("../config/logger");
const multer = require("multer");
const path   = require("path");

/* Carpeta temporal: usa la constante UPLOAD_DIR creada arriba */
const TMP_DIR = path.join(__dirname, "..", "uploads")

/* Extensiones permitidas (agrega el punto faltante) */
const ALLOWED_EXT = [".pdf", ".docx", ".xlsx", ".csv"];

/* Tamaño máximo 50 MB */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: TMP_DIR,
  filename: (_req, file, cb) => {
    // Evita espacios raros:
    const ts   = Date.now();
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${ts}-${base}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    logger.warn(`Archivo rechazado por extensión: ${file.originalname}`);
    return cb(new Error("Tipo de archivo no permitido"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload.array("files");   // «files» debe coincidir con el campo
