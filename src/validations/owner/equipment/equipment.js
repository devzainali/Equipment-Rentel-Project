const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateEquipment(equipment) {
  const schema = {
    title: Joi.string().min(3).max(30).required(),
    make: Joi.string().min(3).max(30).required(),
    model: Joi.string().trim().required(),
    yearOfRegistration: Joi.optional(),
    description: Joi.optional(),
    mileage: Joi.optional(),
    country: Joi.optional(),
    city: Joi.optional(),
    address: Joi.optional(),
    dailyRate: Joi.number().integer().required(),
    weekelyRate: Joi.number().integer().required(),
    monthelyRate: Joi.number().integer().required(),
    image: Joi.optional(),
    categoryId: Joi.string().trim().required(),
    subCategoryId: Joi.string().trim().required(),

  };

  return Joi.validate(equipment, schema);
}
function validateEquipmentUpdate(equipment) {
  const schema = {
    //id: Joi.number().integer().min(1).required(),
    title: Joi.string().min(3).max(30).required(),
    make: Joi.string().min(3).max(30).required(),
    model: Joi.string().trim().required(),
    yearOfRegistration: Joi.optional(),
    description: Joi.optional(),
    mileage: Joi.optional(),
    country: Joi.optional(),
    city: Joi.optional(),
    address: Joi.optional(),
    dailyRate: Joi.number().integer().trim().required(),
    weekelyRate: Joi.number().integer().trim().required(),
    monthelyRate: Joi.number().integer().trim().required(),
    image: Joi.optional(),
    categoryId: Joi.string().trim().required(),
    subCategoryId: Joi.string().trim().required(),
    ID: Joi.string().trim().required(),
  };

  return Joi.validate(equipment, schema);
}

function validateUpdateStatus(equipment) {
  const schema = {
    //id: Joi.number().integer().min(1).required(),
    active: Joi.string().required(),
    ID: Joi.string().trim().required(),
  };

  return Joi.validate(equipment, schema);
}




exports.validate = validateEquipment;
exports.validateUpdate = validateEquipmentUpdate;
exports.validateUpdateStatuss = validateUpdateStatus;
//   exports.validatelogin = validateOwnerLogin;
  //exports.token = generateAuthToken;