const logger = require("./logger");
const { createClient } = require("@supabase/supabase-js");
const { SUPABASE_KEY, SUPABASE_URL } = require("./env");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
logger.info("SUPABASE CONECTADO");

module.exports = { supabase };
