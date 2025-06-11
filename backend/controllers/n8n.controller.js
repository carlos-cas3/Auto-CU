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

  // Ruta absoluta del archivo .puml
  const folderPath = path.join(__dirname, "..", "..", "docs", "casos_uso");
  const filePath = path.join(folderPath, `${id}.puml`);

  try {
    // Crear carpeta si no existe
    await fs.promises.mkdir(folderPath, { recursive: true });

    // Escribir archivo .puml
    await fs.promises.writeFile(filePath, data.plantuml_text);
    console.log(`✅ Archivo .puml guardado en: ${filePath}`);

    // Comando Docker para generar imagen PNG
    const dockerCmd = `docker run --rm -v "${folderPath}:/workspace" plantuml/plantuml -tpng /workspace/${id}.puml`;
    await exec(dockerCmd);

    const imageUrl = `http://localhost:5000/imagenes/${id}.png`;

    // Actualizar la tabla con la URL de la imagen generada
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
      imageUrl
    });

  } catch (err) {
    console.error("❌ Error en el proceso:", err);
    return res.status(500).json({ error: "Error en el procesamiento del diagrama" });
  }
};

exports.getImageUrl = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID en los parámetros" });
  }

  const { data, error } = await supabase
    .from("diagrams")
    .select("image_url")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Error al obtener image_url de Supabase:", error);
    return res.status(500).json({ error: "Error al consultar la base de datos" });
  }

  if (!data || !data.image_url) {
    return res.status(404).json({ error: "No se encontró la imagen para ese ID" });
  }

  return res.json({ imageUrl: data.image_url });
};

