const axios = require("axios");

const LANGCHAIN_SERVICE_URL = "http://127.0.0.1:8000";

function extractCUandRF(test_cases) {
    const cuMap = new Map();
    const rfMap = new Map();

    for (const { cu, rf } of test_cases) {
        if (cu && !cuMap.has(cu))
            cuMap.set(cu, { original: cu, cleaned: null });
        if (rf && !rfMap.has(rf))
            rfMap.set(rf, { original: rf, cleaned: null });
    }

    return {
        valid_cu: Array.from(cuMap.values()),
        valid_rf: Array.from(rfMap.values()),
    };
}

exports.sendToLangchain = async (text) => {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        console.error("❌ Texto inválido proporcionado para análisis:", text);
        throw new Error("Texto vacío o no válido proporcionado.");
    }

    try {
        console.log("📤 Enviando texto a Langchain Service...");
        console.log("🔍 Primeros 200 caracteres:", text.slice(0, 200));
        console.log(`🌐 Endpoint: ${LANGCHAIN_SERVICE_URL}/analyze/`);

        // ✅ Prueba con GET real a /docs o /openapi.json
        try {
            await axios.get(`${LANGCHAIN_SERVICE_URL}/docs`, { timeout: 3000 });
            console.log("🚦 Langchain-service está disponible.");
        } catch (checkErr) {
            throw new Error(
                `Langchain-service no está disponible en ${LANGCHAIN_SERVICE_URL}`
            );
        }

        const response = await axios.post(
            `${LANGCHAIN_SERVICE_URL}/analyze/`,
            { text },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 2 * 60 * 60 * 1000, // 2 horas
                maxContentLength: Infinity,
            }
        );

        console.log("✅ Respuesta recibida de langchain-service");

        const { test_cases } = response.data;

        if (!test_cases || !Array.isArray(test_cases)) {
            console.warn(
                "⚠️ La respuesta no contiene test_cases válidos:",
                response.data
            );
            throw new Error("Respuesta del servicio incompleta o incorrecta.");
        }

        const { valid_cu, valid_rf } = extractCUandRF(test_cases);

        return {
            valid_cu,
            valid_rf,
            test_cases,
        };
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
