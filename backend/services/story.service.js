// services/story.service.js

const { supabase } = require("../config/supabase");

/**
 * Inserta una nueva historia de usuario en la tabla user_stories
 * @param {Object} data - Datos de la historia
 * @param {string} data.title - Título del archivo o historia
 * @param {string} data.file_url - URL pública del archivo subido
 * @param {string} data.file_extension - Extensión del archivo (ej. 'docx', 'pdf')
 */
async function createStory({ title, file_url, file_extension }) {
  const { data, error } = await supabase
    .from("user_stories")
    .insert([
      {
        title,
        file_url,
        file_extension,
      },
    ])
    .select("id")
    .single();

  if (error) {
    throw new Error("Error al crear historia: " + error.message);
  }

  return data;
}

/**
 * Recupera todos los datos relacionados a una historia
 * @param {string} id - UUID de la historia
 */
async function getStoryById(id) {
  const { data: story, error: storyError } = await supabase
    .from("user_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (storyError) throw new Error(storyError.message);

  const { data: useCases, error: useCaseError } = await supabase
    .from("use_case")
    .select("*")
    .eq("story_id", id);

  if (useCaseError) throw new Error(useCaseError.message);

  const { data: rfList, error: rfError } = await supabase
    .from("functional_requirement")
    .select("*")
    .eq("story_id", id);

  if (rfError) throw new Error(rfError.message);

  const { data: testCases, error: testCaseError } = await supabase
    .from("test_case")
    .select("*")
    .eq("story_id", id);

  if (testCaseError) throw new Error(testCaseError.message);

  return {
    ...story,
    use_cases: useCases,
    functional_requirements: rfList,
    test_cases: testCases,
  };
}

module.exports = {
  createStory,
  getStoryById,
};
