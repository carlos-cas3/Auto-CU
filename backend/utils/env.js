// utils/env.js
function getWebhookUrl() {
  const env = process.env.N8N_ENV || "production";

  if (env === "test") return process.env.N8N_WEBHOOK_URL_TEST;
  return process.env.N8N_WEBHOOK_URL_PROD;
}

module.exports = { getWebhookUrl };
