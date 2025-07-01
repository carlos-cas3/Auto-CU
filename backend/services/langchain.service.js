const axios = require("axios");

const LANGCHAIN_SERVICE_URL =
    process.env.LANGCHAIN_SERVICE_URL || "http://localhost:8000";

exports.sendToLangchain = async (text) => {
    try {
        const response = await axios.post(`${LANGCHAIN_SERVICE_URL}/analyze/`, {
            text,
        });

        return response.data; // Esto debe contener { test_cases: [...] }
    } catch (error) {
        console.error(
            "❌ Error al comunicar con Langchain Service:",
            error.message
        );
        if (error.response) {
            console.error("📩 Respuesta del servicio:", error.response.data);
        }
        throw new Error("Fallo al comunicarse con langchain-service");
    }
};
