const fs = require("fs");
const { supabase } = require("../config/supabase");

const BUCKET_NAME = process.env.SUPABASE_BUCKET;

if (!BUCKET_NAME) {
  throw new Error("SUPABASE_BUCKET no está definido en el archivo .env");
}

async function subirArchivoASupabase(file) {
  const fileContent = fs.readFileSync(file.path);
  const fileName = `${Date.now()}_${file.originalname}`;

  console.log(`📤 Subiendo archivo a bucket "${BUCKET_NAME}": ${fileName}`);

  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(fileName, fileContent, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("❌ Error al subir a Supabase:", error.message);
    throw error;
  }

  const { data: publicData, error: urlError } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  if (urlError) {
    console.warn("⚠️ Error obteniendo URL pública:", urlError.message);
  }

  return {
    originalName: file.originalname,
    storedName: fileName,
    path: data?.path ?? "",
    publicURL: publicData?.publicUrl ?? null,
  };
}

async function subirArchivosASupabase(files) {
  const resultados = [];
  for (const file of files) {
    try {
      const info = await subirArchivoASupabase(file);
      resultados.push(info);
    } catch (err) {
      console.warn(`⚠️ Falló al subir archivo ${file.originalname}:`, err.message);
    }
  }
  return resultados;
}

async function eliminarArchivoSupabase(fileName) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
  if (error) {
    console.warn(`⚠️ Error al eliminar ${fileName} de Supabase:`, error.message);
  } else {
    console.log(`🗑️ Archivo eliminado del bucket: ${fileName}`);
  }
}

module.exports = {
  subirArchivoASupabase,
  subirArchivosASupabase,
  eliminarArchivoSupabase,
};
