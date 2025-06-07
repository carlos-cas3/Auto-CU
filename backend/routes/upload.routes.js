const express = require("express");
const router = express.Router();
const multerMiddleware = require("../middlewares/multer.middleware");
const uploadController = require("../controllers/upload.controller");

router.post("/upload", multerMiddleware, uploadController.handleUpload);

module.exports = router;
