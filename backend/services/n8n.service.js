const logger = require("../config/logger");
const axios  = require("axios");
const { N8N_WEBHOOK_URL } = require("../config/env");

/**
 * Envía el story_id al Webhook Trigger de n8n
 * @param {string} storyId
 */
async function sendToN8N(storyId) {
  try {
    await axios.post(N8N_WEBHOOK_URL, { story_id: storyId }, { timeout: 5000 });
    logger.info(`📤 story_id ${storyId} enviado a n8n`);
  } catch (err) {
    logger.error(`❌ No se pudo enviar a n8n: ${err.message}`);
    throw err;                  // para que el controller decida reintentar o encolar
  }
}

module.exports = { sendToN8N };
