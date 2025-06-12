const { supabase } = require("../config/supabase");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

exports.receiveFromN8N = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID en el cuerpo de la solicitud" });
  }

  const { data, error } = await supabase
    .from("diagrams")
    .select("plantuml_text")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Error al consultar Supabase:", error);
    return res.status(500).json({ error: "Error al consultar la base de datos" });
  }

  if (!data) {
    return res.status(404).json({ error: "No se encontró un diagrama con ese ID" });
  }

  const folderPath = path.join(__dirname, "..", "..", "docs", "casos_uso");
  const filePath = path.join(folderPath, `${id}.puml`);

  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, data.plantuml_text);
    console.log(`✅ Archivo .puml guardado en: ${filePath}`);

    const dockerCmd = `docker run --rm -v "${folderPath}:/workspace" plantuml/plantuml -tpng /workspace/${id}.puml`;
    await exec(dockerCmd);

    const imageUrl = `http://localhost:5000/imagenes/${id}.png`;

    const { error: updateError } = await supabase
      .from("diagrams")
      .update({ image_url: imageUrl })
      .eq("id", id);

    if (updateError) {
      console.error("❌ Error al actualizar la URL de la imagen en Supabase:", updateError);
      return res.status(500).json({ error: "Error al actualizar la URL de la imagen en la base de datos" });
    }

    console.log(`✅ Imagen PNG generada: ${id}.png`);
    return res.json({
      message: "Archivo .puml y .png generados correctamente",
      imageUrl,
      id
    });

  } catch (err) {
    console.error("❌ Error en el proceso:", err);
    return res.status(500).json({ error: "Error en el procesamiento del diagrama" });
  }
};


exports.getImageUrl = async (req, res) => {
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
