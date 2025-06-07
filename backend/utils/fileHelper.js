const fs = require("fs");
const FormData = require("form-data");

exports.buildFormData = (files) => {
    const form = new FormData();
    const archivosPorExtension = {};

    files.forEach((archivo) => {
        const extension = archivo.originalname.split(".").pop().toLowerCase();
        if (!archivosPorExtension[extension]) archivosPorExtension[extension] = [];
        archivosPorExtension[extension].push(archivo.originalname);

        form.append(
            `file_${archivo.originalname}`,
            fs.createReadStream(archivo.path),
            archivo.originalname
        );
    });

    form.append("archivosPorExtension", JSON.stringify(archivosPorExtension));

    return { form, archivosPorExtension };
};

exports.cleanupFiles = (files) => {
    files.forEach((archivo) => {
        try {
            if (fs.existsSync(archivo.path)) fs.unlinkSync(archivo.path);
        } catch (err) {
            console.warn(`⚠️ No se pudo borrar ${archivo.path}: ${err.message}`);
        }
    });
};
