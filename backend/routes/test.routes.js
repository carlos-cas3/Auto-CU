// routes/test.routes.js
const express = require("express");
const router = express.Router();
const { saveAnalyzeOutput } = require("../services/test_generation.service");

router.post("/test-insert", async (req, res) => {
    try {
        const result = await saveAnalyzeOutput(
            req.body.story_id,
            req.body.data
        );
        res.json({ message: "Datos insertados", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
