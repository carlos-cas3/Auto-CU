const fileHelper = require("../utils/fileHelper");
const n8nService = require("../services/n8n.service");

exports.handleUpload = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No se proporcionaron archivos.");
    }

    try {
        const { form, archivosPorExtension } = fileHelper.buildFormData(req.files);
        await n8nService.sendToN8N(form);
        fileHelper.cleanupFiles(req.files);

        res.status(200).send("Archivos y agrupación enviados a n8n.");
    } catch (error) {
        console.error("❌ Error al enviar archivos:", error.message);
        fileHelper.cleanupFiles(req.files);

        if (!res.headersSent) {
            res.status(500).send("Error al enviar archivos a n8n.");
        }
    }
};

const { subirArchivoASupabase } = require("../services/storage.service");

exports.subirArchivos = async (req, res) => {
    try {
        const paths = [];

        for (const archivo of req.files) {
            const rutaSupabase = await subirArchivoASupabase(archivo);
            paths.push(rutaSupabase);

            // Eliminar el archivo local temporal
            fs.unlinkSync(archivo.path);
        }

        res.status(200).json({
            mensaje: "Archivos subidos a Supabase correctamente.",
            paths,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al subir a Supabase" });
    }
};
