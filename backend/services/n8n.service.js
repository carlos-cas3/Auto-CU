const axios = require("axios");

exports.sendToN8N = async (form) => {
    const url = process.env.N8N_WEBHOOK_URL;
    const headers = form.getHeaders();

    return await axios.post(url, form, { headers });
};
