const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateForgot(forgot) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
  };

  return Joi.validate(forgot, schema);
}
function validateForgotCheck(forgot) {
  const schema = {
    hash: Joi.string().required(),
  };

  return Joi.validate(forgot, schema);
}

function validateReset(forgot) {
  const schema = {
    hash: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  };

  return Joi.validate(forgot, schema);
}

exports.validate = validateForgot;
exports.validateUpdate = validateForgotCheck;
exports.validateUpdateReset = validateReset;

