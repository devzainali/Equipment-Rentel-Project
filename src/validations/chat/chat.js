const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateChat(chat) {
  const schema = {
    renterID: Joi.string().min(1).required(),
    ownerID: Joi.string().min(1).required(),
    senderID: Joi.string().min(1).required(),
    receiverID: Joi.string().min(1).required(),
    message: Joi.string().min(1).required(),
  };

  return Joi.validate(chat, schema);
}


function validateGet(chat) {
  const schema = {
    renterID: Joi.string().min(1).required(),
    ownerID: Joi.string().min(1).required(),
  };

  return Joi.validate(chat, schema);
}

exports.validate = validateChat;

exports.validateUpdate = validateGet;
