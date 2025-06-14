const express = require("express");
const router = express.Router();
const { getStory } = require("../controllers/story.controller");

router.get("/:id", getStory);

module.exports = router;
