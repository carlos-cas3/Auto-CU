const fs = require("fs");

exports.cleanupFiles = (files) => {
    files.forEach((archivo) => {
        try {
            if (fs.existsSync(archivo.path)) fs.unlinkSync(archivo.path);
        } catch (err) {
            console.warn(
                `⚠️ No se pudo borrar ${archivo.path}: ${err.message}`
            );
        }
    });
};
