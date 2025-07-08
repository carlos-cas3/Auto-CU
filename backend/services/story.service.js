// services/story.service.js

const { supabase } = require("../config/supabase");

/** GET /story/:id */
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
// Export the function for use in controllers
module.exports = { getStoryById };