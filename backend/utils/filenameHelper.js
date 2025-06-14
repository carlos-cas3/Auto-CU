const path = require("path");
const { randomUUID } = require("crypto");

/**
 * Genera un nombre único para almacenar el archivo, manteniendo su extensión original.
 * @param {string} originalname
 * @returns {string} Ejemplo: f4e1c...e6f.pdf
 */
function generateStoredName(originalname) {
    const ext = path.extname(originalname) || "";
    return `${randomUUID()}${ext.toLowerCase()}`;
}

module.exports = { generateStoredName };
