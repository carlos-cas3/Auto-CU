// controllers/upload.controller.js
const path = require("path");
const logger = require("../config/logger");
const { n8nHealthy } = require("../utils/n8nHealth");
const { subirArchivosASupabase, eliminarArchivoSupabase } = require("../services/storage.service");
const { createStory } = require("../services/story.service");        // ← nombre coherente
const { sendToN8N } = require("../services/n8n.service");
const { cleanupFiles } = require("../utils/fileUtils");
const { N8N_BASE_URL, N8N_WEBHOOK_URL } = require("../config/env");  // exportados desde env.js

exports.subirHistoria = async (req, res, next) => {
    logger.debug("📦 req.files recibido:", req.files);
  logger.debug("📝 req.body recibido:", req.body);/*  */
  if (!req.files?.length) {
    return res.status(400).json({ mensaje: "No se proporcionaron archivos." });
  }

  let archivosSubidos = [];

  try {
    /* 1. Verificar salud de n8n ------------------------------------------------ */
    logger.info("🔍 Verificando salud de n8n…");
    if (!(await n8nHealthy(N8N_BASE_URL))) {
      cleanupFiles(req.files);
      return res.status(503).json({ mensaje: "n8n no disponible. Inténtelo más tarde." });
    }

    /* 2. Subir archivos a Supabase ------------------------------------------- */
    logger.info("⏫ Subiendo archivos a Supabase…");
    archivosSubidos = await subirArchivosASupabase(req.files);
    logger.debug("📦 Despues req.files:", req.files);
    if (archivosSubidos.length === 0) throw new Error("No se pudo subir ningún archivo.");

    // Asumimos un solo archivo por historia
    const archivo = archivosSubidos[0];

    /* 3. Insertar historia en la BD ------------------------------------------ */
    logger.info("📝 Insertando registro en user_stories…");
    const historia = await createStory({
      title         : req.body.titulo || archivo.originalName,
      file_url      : archivo.publicURL,
      file_extension: path.extname(archivo.originalName).slice(1), // pdf, docx, etc.
    });

    /* 4. Enviar story_id a n8n ------------------------------------------------ */
    logger.info(`📤 Enviando story_id ${historia.id} a n8n…`);
    await sendToN8N({ story_id: historia.id }, N8N_WEBHOOK_URL);

    /* 5. Limpieza y respuesta ------------------------------------------------- */
    cleanupFiles(req.files);
    return res.status(201).json({
      story_id: historia.id,
      file_url: archivo.publicURL,
    });

  } catch (err) {
    /* Rollback de lo subido a Supabase si algo falló ------------------------- */
    logger.error("❌ Error en flujo de subida:", err);
    for (const a of archivosSubidos) {
      try { await eliminarArchivoSupabase(a.storedName); } catch (_) {}
    }
    cleanupFiles(req.files);
    return next(err);   // delega al middleware global de errores
  }
};
