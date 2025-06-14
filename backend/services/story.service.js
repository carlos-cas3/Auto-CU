const { supabase } = require("../config/supabase");

/* Inserta y devuelve la fila completa, incluido el id generado */
async function createStory({ title, file_url, file_extension }) {
  const { data, error } = await supabase
    .from("user_stories")
    .insert([{ title, file_url, file_extension }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;          // { id, title, ... }
}

/** GET /story/:id */
async function getStoryById(id) {
  const { data, error } = await supabase
    .from("user_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { createStory, getStoryById };
