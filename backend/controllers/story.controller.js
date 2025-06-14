// backend/controllers/story.controller.js
const logger = require("../config/logger");
const { getStoryById } = require("../services/story.service");

exports.getStory = async (req, res, next) => {
    const { id } = req.params;

    try {
        logger.debug(`🗄️  Buscando historia ${id} en la BD…`);
        const story = await getStoryById(id);

        if (!story) {
            logger.warn(`⚠️  Historia ${id} no encontrada`);
            return res.status(404).json({ msg: "No encontrada" });
        }

        logger.info(`✅  Historia ${id} encontrada`);
        return res.json(story);
    } catch (err) {
        logger.error(`❌  Error al consultar historia ${id}: ${err.message}`);
        return next(err); // deja que el errorHandler global responda
    }
};
