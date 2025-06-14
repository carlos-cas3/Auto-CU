// backend/routes/index.js
const express = require("express");
const router = express.Router();

const uploadRoutes = require("./upload.routes");
const n8nRoutes = require("./n8n.routes");
const storyRoutes = require("./story.routes")

router.use("/upload", uploadRoutes);
router.use("/n8n", n8nRoutes);
router.use("/story", storyRoutes); //  GET /api/story/:id

module.exports = router;
