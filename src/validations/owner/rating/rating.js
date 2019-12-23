const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validate(rating) {
  const schema = {
    equipmentStar: Joi.number().min(0).max(5.0).required(),
    ownerStar: Joi.number().min(0).max(5.0).required(),
    renterId: Joi.string().trim().required(),
    equipmentId: Joi.string().trim().required(),
    ownerId: Joi.string().trim().required(),
    review: Joi.string().trim().required(),
  };

  return Joi.validate(rating, schema);
}

exports.validate = validate;
  //exports.token = generateAuthToken;