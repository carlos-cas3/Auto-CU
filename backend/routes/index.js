// backend/routes/index.js
const express = require("express");
const router = express.Router();

const uploadRoutes = require("./upload.routes");
const n8nRoutes = require("./n8n.routes");

router.use("/upload", uploadRoutes);   // POST /api/upload
router.use("/n8n", n8nRoutes);         // POST /api/n8n/from-n8n

module.exports = router;
