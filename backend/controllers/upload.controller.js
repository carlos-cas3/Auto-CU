  // controllers/upload.controller.js
  const { verificarWebhookActivo } = require("../utils/webHookTriggerCheck");
  const { subirArchivosASupabase, eliminarArchivoSupabase } = require("../services/storage.service");
  const { sendToN8N } = require("../services/n8n.service");
  const { cleanupFiles } = require("../utils/fileHelper");
  const FormData = require("form-data");

  exports.subirYEnviarArchivos = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ mensaje: "No se proporcionaron archivos." });
  }

  // 🔄 Determinar URL según entorno
  const entorno = process.env.N8N_ENV;
  const webhookUrl = entorno === "production"
    ? process.env.N8N_WEBHOOK_URL_PROD
    : process.env.N8N_WEBHOOK_URL_TEST;

  try {
    console.log("🔍 Verificando si el webhook está activo...");
    const webhookActivo = await verificarWebhookActivo(webhookUrl);

    if (!webhookActivo) {
      console.warn("❌ Webhook inactivo. Deteniendo flujo.");
      cleanupFiles(req.files);
      return res.status(503).json({ mensaje: "El webhook de N8N no está activo." });
    }

    console.log("✅ Webhook activo. Procediendo con la subida a Supabase...");

    const archivosSubidos = await subirArchivosASupabase(req.files);
    const metadatos = archivosSubidos.map((archivo) => ({
      nombreOriginal: archivo.originalName,
      nombreGuardado: archivo.storedName,
      urlPublica: archivo.publicURL,
      extension: archivo.originalName.split(".").pop(),
    }));
    


    const form = new FormData();
    form.append("metadatos", JSON.stringify(metadatos));

    console.log("📤 Enviando metadatos al webhook N8N...");
    await sendToN8N(form, webhookUrl); // pasa url explícita

    cleanupFiles(req.files);

    res.status(200).json({
      mensaje: "Archivos subidos a Supabase y metadatos enviados a N8N.",
      metadatos,
    });

  } catch (error) {
    console.error("❌ Error en el flujo completo:", error.message);

    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await eliminarArchivoSupabase(file.storedName);
        } catch (_) {}
      }
    }

    cleanupFiles(req.files);
    res.status(500).json({ mensaje: "Error al subir o enviar archivos.", error: error.message });
  }
};
