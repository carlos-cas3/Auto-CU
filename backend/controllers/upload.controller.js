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
