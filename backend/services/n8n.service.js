const axios = require("axios");
const { getWebhookUrl } = require("../utils/env");

exports.sendToN8N = async (form, url) => {
  if (!url) {
    throw new Error("No se proporcionó la URL del webhook de N8N.");
  }

  try {
    const headers = form.getHeaders();
    console.log("📡 Enviando metadatos a N8N:", url);
    
    const response = await axios.post(url, form, { headers });

    if (response.status >= 200 && response.status < 300) {
      console.log("✅ Metadatos enviados correctamente a N8N.");
    } else {
      console.warn(`⚠️ N8N respondió con un estado inesperado: ${response.status}`);
    }

    return response.data;

  } catch (error) {
    console.error("❌ Error al enviar metadatos a N8N:", error.message);
    if (error.response) {
      console.error("🛑 Respuesta del servidor N8N:", error.response.status, error.response.data);
    }
    throw new Error("No se pudo enviar los metadatos a N8N.");
  }
};
