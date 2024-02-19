const Joi = require("joi");

module.exports.ActivitySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  billable: Joi.boolean().required(),
  plannedQuota: Joi.number().required(),
  tags: Joi.array().items(Joi.object()),
});
