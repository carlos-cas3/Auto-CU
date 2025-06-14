const logger = require("../config/logger");
const multer = require("multer");
const path = require("path");

/* Carpeta temporal */
const TMP_DIR = "uploads";

/* Extensiones permitidas */
const ALLOWED_EXT = [".pdf", ".docx", "xlsx", "csv"];

/* Tamaño permitido 50MB */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: TMP_DIR,
    filename: (_req, file, cb) => {
        const unique =
            Date.now() + "-" + file.originalname; /* Nombre Temporal */
        cb(null, unique);
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

module.exports = upload.array("files"); // “files” debe coincidir con el name del <input>
