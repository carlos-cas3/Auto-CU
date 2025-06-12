const express = require("express");
const router = express.Router();
const n8nController = require("../controllers/n8n.controller");

router.post("/from-n8n", n8nController.receiveFromN8N);
router.get("/image-url/:id", n8nController.getImageUrl);

router.get("/last-id", n8nController.getLastDiagramId);


module.exports = router;
