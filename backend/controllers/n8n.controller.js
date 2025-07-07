const { supabase } = require("../config/supabase");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const langchainService = require("../services/langchain.service")
const testGenService = require("../services/test_generation.service");


exports.processStoryFromN8N = async (req, res) => {
  const { content, story_id } = req.body;

  if (!story_id || !content) {
    return res.status(400).json({ error: "Faltan campos requeridos (story_id o content)" });
  }

  console.log("📩 Historia recibida:", story_id);
  console.log("📝 Contenido (truncado):", content.slice(0, 200));

  try {
    const langchainResult = await langchainService.sendToLangchain(content);

    const saved = await testGenService.saveAnalyzeOutput(story_id, langchainResult);

    return res.status(200).json({
      message: "Historia procesada y guardada exitosamente",
      ...saved,
    });
  } catch (err) {
    console.error("❌ Error en procesamiento:", err);
    return res.status(500).json({
      error: "Error al procesar historia",
      details: err.message,
    });
  }
};


/* exports.getImageUrl = async (req, res) => {
  const { id } = req.params;
  console.log("🪪 ID recibido en backend:", id);

  try {
    const { data, error } = await supabase
      .from("diagrams")
      .select("image_url")
      .eq("id", id)
      .single();

    console.log("📦 Data:", data);
    console.log("❌ Error Supabase:", error);

    if (error) {
      return res.status(500).json({
        message: "Error al consultar Supabase",
        error: error.message,
      });
    }

    if (!data || !data.image_url) {
      return res.status(404).json({
        message: "No se encontró la imagen con ese ID",
      });
    }

    return res.json({ imageUrl: data.image_url });
  } catch (err) {
    console.error("💥 Error interno del servidor:", err);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: err.message,
    });
  }
};

exports.getLastDiagramId = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("diagrams")
      .select("id")
      .order("created_at", { ascending: false }) // usa este campo
      .limit(1);

    if (error) {
      console.error("❌ Error al obtener el último ID:", error);
      return res.status(500).json({ error: "Error al consultar Supabase" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No hay diagramas disponibles" });
    }

    return res.json({ id: data[0].id });
  } catch (err) {
    console.error("💥 Error interno:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
 */