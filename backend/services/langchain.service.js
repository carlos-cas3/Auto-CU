const axios = require("axios");

const LANGCHAIN_SERVICE_URL =
    process.env.LANGCHAIN_SERVICE_URL || "http://localhost:8000";

exports.sendToLangchain = async (text) => {
    // Validación básica antes de hacer la solicitud
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        console.error("❌ Texto inválido proporcionado para análisis:", text);
        throw new Error("Texto vacío o no válido proporcionado.");
    }

    try {
        console.log("📤 Enviando texto a Langchain Service...");
        console.log("🔍 Primeros 200 caracteres:", text.slice(0, 200));
        console.log(`🌐 Endpoint: ${LANGCHAIN_SERVICE_URL}/analyze/`);

        const response = await axios.post(
            `${LANGCHAIN_SERVICE_URL}/analyze/`,
            { text },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 60000, // 60 segundos por si el modelo tarda
            }
        );

        console.log("✅ Respuesta recibida de langchain-service");

        // Validar que el resultado contiene lo esperado
        if (!response.data || !Array.isArray(response.data.test_cases)) {
            console.warn(
                "⚠️ La respuesta no contiene test_cases válidos:",
                response.data
            );
            throw new Error("Respuesta del servicio incompleta o incorrecta.");
        }

        return response.data;
    } catch (error) {
        console.error("❌ Error al comunicar con Langchain Service:");
        console.error("📛 Mensaje:", error.message);

        if (error.response) {
            console.error("📩 Status code:", error.response.status);
            console.error("📩 Data:", error.response.data);
        } else if (error.request) {
            console.error(
                "⏳ No hubo respuesta del servidor (request no respondido)"
            );
        } else {
            console.error(
                "❗ Error al configurar la solicitud:",
                error.message
            );
        }

        throw new Error("Fallo al comunicarse con langchain-service");
    }
};
