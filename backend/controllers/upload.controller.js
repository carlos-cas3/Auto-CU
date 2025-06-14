const logger = require("../config/logger");
const { n8nHealthy } = require("../utils/n8nHealth");
const {
    /* revisar */ subirArchivosASupabase,
    eliminarArchivoSupabase,
} = require("../services/storage.service");
const { insertarHistoria } = require();
const { sendToN8N } = require("../services/n8n.service"); /* revisar */
const { cleanupFiles } = require("../utils/fileUtils"); /* revisar */

const N8N_URL = process.env.N8N_URL;
const N8N_WEBHOOK_URL_PROD = process.env.N8N_WEBHOOK_URL_PROD;

exports.subirHistoria = async (req, res, next) => {
    if (!req.files?.length) {
        return res
            .status(400)
            .json({ mensaje: "No se proporcionaron archivos." });
    }
};

let archivosSubidos = [];

try {
    logger.info("Verifcando estado de n8n . . .");
    if (!(await n8nHealthy(N8N_URL))) {
        cleanupFiles(req.files);
        return res
            .status(503)
            .json({ mensaje: "n8n no disponible. Intentelo mas tarde" });
    }

    logger.info("Subiendo archivos a supabase storage . . .");
    archivosSubidos = await subirArchivosASupabase(req.files);
    const archivo = archivosSubidos[0]; /* un solo archivo ? */

    const historia_usuario = await insertarHistoria({
        title: req.body.titulo || archivo.originalName,
        file_url: archivo.publicURL,
        file_extension: archivo.originalName
            .split(".")
            .pop() /* aqui puede existir archivo que tiene "." en su nombre REVISAR */,
    });

    logger.info("Enviando story_id a N8N");
    await sendToN8N({ story_id: historia_usuario.id }, N8N_WEBHOOK_URL_PROD);

    /* Revisar esto para que esta :v */
    cleanupFiles(req.files);
    return res
        .status(201)
        .json({ story_id: historia.id, file_url: archivo.publicURL });
} catch (err) {
    logger.error("Error en subir el archivo ", err);

    for (const a of archivosSubidos) {
        try {
            await eliminarArchivoSupabase(a.storedName);
        } catch (_) {}
    }
    cleanupFiles(req.files);
    return res
        .status(500)
        .json({ mensaje: "Error interno", error: err.message });
}
