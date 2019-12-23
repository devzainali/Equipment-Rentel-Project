const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validate(category) {
  const schema = {
    name: Joi.string().trim().required(),
  };

  return Joi.validate(category, schema);
}
function validateSubCategory(subCategory) {
  const schema = {
    name: Joi.string().trim().required(),
    parentId: Joi.required(),
  };

  return Joi.validate(subCategory, schema);
}

function validateDelete(faq) {
  const schema = {
    ID: Joi.required(),
  };

  return Joi.validate(faq, schema);
}

exports.validate = validate;
exports.validateCategory = validateSubCategory;
exports.validateDelete = validateDelete;
