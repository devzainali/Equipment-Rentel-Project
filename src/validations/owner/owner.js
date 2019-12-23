const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateOwner(owner) {
  const schema = {
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    contactNo: Joi.string().trim().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    country: Joi.optional(),
    city: Joi.optional(),
    address: Joi.optional(),
  };

  return Joi.validate(owner, schema);
}
function validateOwnerUpdate(owner) {
  const schema = {
    //id: Joi.number().integer().min(1).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    contactNo: Joi.string().trim().required(),
    country: Joi.optional(),
    city: Joi.optional(),
    address: Joi.string().min(1).optional(),
    companyName: Joi.string().min(3).max(30).optional(),
  };

  return Joi.validate(owner, schema);
}

function validateOwnerLogin(owner) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().min(3).max(30).required(),
  };

  return Joi.validate(owner, schema);
}
function validateImage(company) {
  const schema = {
    Image: Joi.required(),
  };

  return Joi.validate(company, schema);
}


exports.validate = validateOwner;
exports.validateUpdate = validateOwnerUpdate;
exports.validatelogin = validateOwnerLogin;
exports.validateImage = validateImage;
  //exports.token = generateAuthToken;