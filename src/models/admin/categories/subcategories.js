const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('subcategory', {
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
    parentId: {
        type: Sequelize.STRING(44),
        allowNull: false,
    },

}, {
    timestamps: true,
    paranoid: true
});