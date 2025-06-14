const logger = require("./logger");
require("dotenv").config();

/* Variables necesarias para correr el programa */
const REQUIRED_VARS = [
    "N8N_WEBHOOK_URL",
    "N8N_WEBHOOK_URL_PROD",
    "SUPABASE_BUCKET",
    "SUPABASE_URL",
    "SUPABASE_KEY",
];

function validateVarsEnv() {
    REQUIRED_VARS.forEach((key) => {
        if (!process.env[key]) {
            logger.error(`Variable de entorno ${key} no definida`);
            process.exit(1);
        }
    });
}

validateVarsEnv();

module.exports = {
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    N8N_WEBHOOK_URL_PROD: process.env.N8N_WEBHOOK_URL_PROD,
    SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
};
