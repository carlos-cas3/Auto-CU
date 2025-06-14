const axios = require("axios");
const logger = require("../config/logger");

/**
 * Devuelve true si n8n responde 200 en /healthz, false en otro caso.
 * @param {string} baseUrl — Ej: https://n8n.my‑org.com
 */

async function n8nHealthy(baseUrl) {
    try {
        const { status } = await axios.get(`${baseUrl}/healthz`, {
            timeout: 2000,
        });
        logger.debug(`n8n /healthz status: ${status}`);
        return status == 200;
    } catch (err) {
        logger.warn("n8n /healthz no respondió:", err.message);
        return false;
    }
}

module.exports = { n8nHealthy };
