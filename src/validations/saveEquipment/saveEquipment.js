const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//validation


function validateSave(save) {
    const schema = {
        equipmentId: Joi.string().required(),
    };

    return Joi.validate(save, schema);
}

exports.validate = validateSave;
