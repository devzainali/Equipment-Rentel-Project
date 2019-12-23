const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('page', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    pageTitle: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },

});