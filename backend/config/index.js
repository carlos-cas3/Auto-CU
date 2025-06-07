require("dotenv").config();

function loadEnv() {
    if (!process.env.N8N_WEBHOOK_URL) {
        console.error("❌ N8N_WEBHOOK_URL no está definido.");
        process.exit(1);
    }
    console.log("📦 N8N_WEBHOOK_URL cargado:", process.env.N8N_WEBHOOK_URL);
}

module.exports = { loadEnv };
