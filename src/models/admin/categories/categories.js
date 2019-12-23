const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(49),
        allowNull: false,
    },
    Image: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },

});