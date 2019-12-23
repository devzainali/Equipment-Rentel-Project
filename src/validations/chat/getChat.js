const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateChat(chat) {
  const schema = {
    seekerID: Joi.string().min(1).required(),
    companyID: Joi.string().min(1).required(),
  };

  return Joi.validate(chat, schema);
}


exports.validate = validateChat;
