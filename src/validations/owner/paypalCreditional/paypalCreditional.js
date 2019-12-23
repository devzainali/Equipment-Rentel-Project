const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validatePaypal(paypal) {
  const schema = {
    owner_id: Joi.required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  };

  return Joi.validate(paypal, schema);
}



exports.validate = validatePaypal;
