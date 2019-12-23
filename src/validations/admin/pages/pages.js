const Joi = require('joi');
//validation
function validate(faq) {
  const schema = {
    ID: Joi.required(),
    pageTitle: Joi.string().trim().min(5).max(255).required(),
    content: Joi.required(),
  };

  return Joi.validate(faq, schema);
}

exports.validate = validate;


