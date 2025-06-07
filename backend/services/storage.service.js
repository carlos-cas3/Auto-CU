// services/storage.service.js
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

async function subirArchivoASupabase(archivo) {
    const contenido = fs.readFileSync(archivo.path);
    const nombre = `archivos/${Date.now()}_${archivo.originalname}`;

    const { data, error } = await supabase.storage
        .from("archivos") // nombre del bucket
        .upload(nombre, contenido, {
            contentType: archivo.mimetype,
        });

    if (error) {
        throw new Error("Error al subir archivo a Supabase: " + error.message);
    }

    return data.path;
}

module.exports = { subirArchivoASupabase };
