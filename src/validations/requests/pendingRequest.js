const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validatependingRequest(pendingRequest) {
  const schema = {
    equipmentId: Joi.string().trim().required(),
    ownerId: Joi.string().trim().required(),
    renterId: Joi.required(),
    location: Joi.string().trim().required(),
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
    totalweeks: Joi.string().trim().required(),
    totalMonths: Joi.string().trim().required(),
    totalDays: Joi.string().trim().required(),
    overAllDays: Joi.string().trim().required(),
    total: Joi.string().trim().required(),
    comments: Joi.string().trim().optional(),
  };

  return Joi.validate(pendingRequest, schema);
}


exports.validate = validatependingRequest;
