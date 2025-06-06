// src/utils/fileUtils.js

/**
 * Elimina archivos duplicados basándose en el nombre.
 * @param {File[]} archivosPrevios
 * @param {File[]} nuevosArchivos
 * @returns {File[]} Archivos sin duplicados
 */
export const filtrarArchivosDuplicados = (archivosPrevios, nuevosArchivos) => {
    const nombresPrevios = new Set(archivosPrevios.map((a) => a.name));
    return nuevosArchivos.filter((archivo) => !nombresPrevios.has(archivo.name));
};

/**
 * Convierte bytes a un string de tamaño legible.
 * @param {number} bytes
 * @returns {string}
 */
export const formatearTamano = (bytes) => {
    if (bytes === 0) return "0 KB";
    return `${(bytes / 1024).toFixed(2)} KB`;
};
