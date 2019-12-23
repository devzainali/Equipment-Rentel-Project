const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('faq', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    question: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    answer: {
        type: Sequelize.TEXT,
        allowNull: false,
    },

});