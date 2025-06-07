const fileHelper = require("../utils/fileHelper");
const supabaseStorage = require("../services/storage.service");
const n8nService = require("../services/n8n.service");
const fileHelperSupabase = require("../utils/fileHelperSupabase");

exports.subirYEnviarArchivos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No se proporcionaron archivos.");
    }

    // 1. Subir archivos a Supabase
    const archivosSupabase = await supabaseStorage.subirArchivosASupabase(req.files);

    // 2. Construir los metadatos para enviar a n8n
    const { form } = await fileHelperSupabase.buildFormDataFromSupabaseInfo(archivosSupabase);

    // 3. Enviar a n8n
    await n8nService.sendToN8N(form);

    // 4. Limpiar archivos temporales locales
    fileHelper.cleanupFiles(req.files);

    res.status(200).json({
      mensaje: "Archivos subidos y metadatos enviados a n8n.",
      archivos: archivosSupabase,
    });
  } catch (error) {
    console.error("❌ Error en la subida y envío:", error.message);
    fileHelper.cleanupFiles(req.files);

    if (!res.headersSent) {
      res.status(500).send("Error al subir archivos o enviar a n8n.");
    }
  }
};
