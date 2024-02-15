const Joi = require("joi");

module.exports.ProjectSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  color: Joi.string(),
  activities: Joi.array().items(Joi.object()),
  tags: Joi.array().items(Joi.object()),
  userID: Joi.string(),
});
