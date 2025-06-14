const logger = require("../config/logger");
const { readFile } = require("fs/promises");
const pLimit = require("p-limit");
const { supabase } = require("../config/supabase");
const { SUPABASE_BUCKET } = require("../config/env");
const { generateStoredName } = require("../utils/filenameHelper");

const CONCURRENCY = 3; /* Maximo archivos en paralelo */
const limit = pLimit(CONCURRENCY);

async function uploadSingle(file) {
    const buffer = await readFile(file.path);
    const storedName = generateStoredName(file.originalName);

    logger.debug(`Subiendo ${storedName} -> BUCKET ${SUPABASE_BUCKET}`);

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storedName, buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    /* Obtener URL pública (si el bucket es público) */
    const { data: pubData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(storedName);

    return {
        originalName: file.originalname,
        storedName,
        publicURL: pubData?.publicUrl || null,
    };
}

/* Sube archivos en paralelo, devuelve solo los que se suben con exito */
async function subirArchivosASupabase(files) {
    const tasks = files.map((f) =>
        limit(() =>
            uploadSingle(f).catch((err) => {
                logger.warn(`⚠️ Falló ${f.originalname}: ${err.message}`);
                return null; // Devolvemos null si falla uno
            })
        )
    );

    const results = await Promise.all(tasks);
    return results.filter(Boolean); // Filtra los null
}

/* Elimina un objecto del bucket por su nombre */
async function eliminarArchivoSupabase(storedName) {
    const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .remove([storedName]);

    if (error) {
        logger.warn(`⚠️ No se pudo eliminar ${storedName}: ${error.message}`);
    } else {
        logger.debug(`🗑️ Eliminado: ${storedName}`);
    }
}

module.exports = {
    subirArchivosASupabase,
    eliminarArchivoSupabase,
};
