// /config/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL o SUPABASE_KEY no están definidas en .env');
  process.exit(1);
}

console.log("🔌 Supabase conectado a:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
