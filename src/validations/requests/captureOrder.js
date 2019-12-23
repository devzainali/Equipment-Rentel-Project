const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateCaptureRequest(CaptureRequest) {
    const schema = {
        acceptID: Joi.string().trim().required(),
        orderID: Joi.string().trim().required(),
    };

    return Joi.validate(CaptureRequest, schema);
}


exports.validate = validateCaptureRequest;
  //exports.token = generateAuthToken;