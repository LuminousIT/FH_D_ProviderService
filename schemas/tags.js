const Joi = require("joi");

module.exports.TagsSchema = Joi.object({
  name: Joi.string().required(),
});
