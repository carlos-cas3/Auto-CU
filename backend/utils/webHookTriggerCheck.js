const axios = require("axios");
const { getWebhookUrl } = require("./env");

async function verificarWebhookActivo() {
  const url = getWebhookUrl();

  try {
    console.log(`🔍 Verificando si el webhook está activo: ${url}`);

    const response = await axios.post(url, {}, { timeout: 5000 });
    const activo = response.status >= 200 && response.status < 400;

    console.log(`✅ Webhook respondió con status: ${response.status}`);
    return activo;

  } catch (error) {
    if (error.response) {
      console.warn(`❌ Webhook inactivo. Status: ${error.response.status}`);
      console.warn("🛑 Respuesta del servidor N8N:", error.response.data);
    } else {
      console.warn("❌ Error al intentar conectar con el webhook:", error.message);
    }
    return false;
  }
}

module.exports = { verificarWebhookActivo };
