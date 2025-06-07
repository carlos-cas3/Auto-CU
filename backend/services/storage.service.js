const fs = require("fs");
const { supabase } = require("../config/supabase");

const BUCKET_NAME = process.env.SUPABASE_BUCKET;

async function subirArchivoASupabase(file) {
  const fileContent = fs.readFileSync(file.path);
  const fileName = `${Date.now()}_${file.originalname}`;

  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(fileName, fileContent, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { publicURL, error: urlError } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  if (urlError) {
    console.warn("⚠️ Error obteniendo URL pública:", urlError.message);
  }

  return {
    originalName: file.originalname,
    storedName: fileName,
    path: data.path,
    publicURL: publicURL || null,
  };
}

async function subirArchivosASupabase(files) {
  const resultados = [];
  for (const file of files) {
    const info = await subirArchivoASupabase(file);
    resultados.push(info);
  }
  return resultados;
}

module.exports = { subirArchivoASupabase, subirArchivosASupabase };
