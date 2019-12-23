const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(3).max(10).required(),
    lastName: Joi.string().min(3).max(10).required(),
    contactNo: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    companyName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    roleID: Joi.number().integer().required(),
  };

  return Joi.validate(user, schema);
}
function validateUserUpdate(user) {
  const schema = {
    //id: Joi.number().integer().min(1).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    contactNo: Joi.string().trim().required(),
    address: Joi.string().min(1).max(30).optional(),
    companyName: Joi.string().min(3).max(30).optional(),
    country: Joi.string().min(1).max(30).optional(),
    city: Joi.string().min(1).max(30).optional(),
    about: Joi.string().min(3).max(2000).optional(),

  };

  return Joi.validate(user, schema);
}
function validateChangeLogin(user) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().min(3).max(30).required(),
    newPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };

  return Joi.validate(user, schema);
}
function validateUserLogin(user) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().min(3).max(30).required(),
  };

  return Joi.validate(user, schema);
}
function validateImage(user) {
  const schema = {
    Image: Joi.required(),
  };

  return Joi.validate(user, schema);
}


exports.validate = validateUser;
exports.validateUpdate = validateUserUpdate;
exports.validatelogin = validateUserLogin;
exports.validateImage = validateImage;
exports.validateChangeLogin = validateChangeLogin;

  //exports.token = generateAuthToken;