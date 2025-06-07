const axios = require("axios");
const FormData = require("form-data");

exports.buildFormDataFromSupabaseInfo = async (supabaseFiles) => {
  const form = new FormData();
  const archivosPorExtension = {};

  for (const archivo of supabaseFiles) {
    const extension = archivo.originalName.split(".").pop().toLowerCase();
    if (!archivosPorExtension[extension]) archivosPorExtension[extension] = [];
    archivosPorExtension[extension].push(archivo.originalName);

    // Añadir los metadatos al form
    form.append("metadatos[]", JSON.stringify({
      nombreOriginal: archivo.originalName,
      nombreGuardado: archivo.storedName,
      urlPublica: archivo.publicURL,
      extension,
    }));
  }

  // También se puede agregar un resumen por extensión
  form.append("archivosPorExtension", JSON.stringify(archivosPorExtension));

  return { form, archivosPorExtension };
};
