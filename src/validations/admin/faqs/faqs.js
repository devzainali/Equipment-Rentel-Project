const Joi = require('joi');
//validation
function validate(faq) {
  const schema = {
    question: Joi.string().trim().min(10).max(255).required(),
    answer: Joi.string().trim().min(10).required(),
  };

  return Joi.validate(faq, schema);
}

function validateUpdate(faq) {
  const schema = {
    ID: Joi.required(),
    question: Joi.string().trim().min(10).max(255).required(),
    answer: Joi.string().trim().min(10).required(),
  };

  return Joi.validate(faq, schema);
}

function validateDelete(faq) {
  const schema = {
    ID: Joi.required(),
  };

  return Joi.validate(faq, schema);
}


exports.validate = validate;
exports.validateUpdate = validateUpdate;
exports.validateDelete = validateDelete;

