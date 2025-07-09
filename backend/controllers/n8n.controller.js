//controllers/n8n.controller.js
const { supabase } = require("../config/supabase");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const langchainService = require("../services/langchain.service");
const testGenService = require("../services/test_generation.service");

exports.receiveStoryAndProcessStory = async (req, res) => {
    const { content, story_id } = req.body;

    if (!story_id || !content) {
        return res
            .status(400)
            .json({ error: "Faltan campos requeridos (story_id o content)" });
    }

    console.log("📥 Historia recibida rápidamente desde N8N:", story_id);
    res.status(200).json({
        message: "Historia recibida. Se procesará en segundo plano.",
        story_id,
    });

    // Procesamiento en segundo plano
    setTimeout(async () => {
        try {
            console.log("⚙️ Procesando historia en background:", story_id);

            const langchainResult = await langchainService.sendToLangchain(
                content
            );
            const saved = await testGenService.saveAnalyzeOutput(
                story_id,
                langchainResult
            );

            console.log("✅ Procesamiento completado:");
            console.log(`🔹 CU: ${saved.use_cases.length}`);
            console.log(`🔹 RF: ${saved.requirements.length}`);
            console.log(`🔹 Casos de prueba: ${saved.test_cases.length}`);
        } catch (err) {
            console.error("❌ Error en procesamiento background:", err.message);
        }
    }, 0); // Ejecuta en el próximo ciclo del event loop
};
