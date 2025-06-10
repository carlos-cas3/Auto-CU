const { supabase } = require("../config/supabase");

const fs = require("fs");
const path = require("path");

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
    console.error("Error al consultar Supabase:", error);
    return res.status(500).json({ error: "Error al consultar la base de datos" });
  }

  if (!data) {
    return res.status(404).json({ error: "No se encontró un diagrama con ese ID" });
  }

  // Ruta hacia la carpeta docs/casos_uso desde el backend
  const filePath = path.join(__dirname, "..", "..", "docs", "casos_uso", `${id}.puml`);

  // Asegurarse de que la carpeta exista
  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) {
      console.error("❌ Error al crear la carpeta destino:", err);
      return res.status(500).json({ error: "Error al preparar el directorio de salida" });
    }

    // Escribir el archivo
    fs.writeFile(filePath, data.plantuml_text, (err) => {
      if (err) {
        console.error("❌ Error al guardar el archivo .puml:", err);
        return res.status(500).json({ error: "Error al guardar el archivo .puml" });
      } else {
        console.log(`✅ Archivo .puml guardado en: ${filePath}`);
        return res.json({ message: "Archivo .puml guardado exitosamente", path: filePath });
      }
    });
  });
};
