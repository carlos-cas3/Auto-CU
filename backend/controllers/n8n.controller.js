const { supabase } = require("../config/supabase");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

exports.processStoryFromN8N = (req, res) => {
  const { content, story_id } = req.body;

  if (!story_id) {
    return res.status(400).json({ error: "Falta story_id en el cuerpo de la solicitud" });
  }

  console.log("📝 content:", content.slice(0, 200));
  console.log("🆔 story_id:", story_id);

  // Aquí llamarías a tus servicios (ej. análisis, guardar en Supabase, etc.)

  res.status(200).json({ message: "Recibido correctamente", received: true });
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