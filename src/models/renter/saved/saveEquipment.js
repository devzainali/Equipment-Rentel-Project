const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('saveequipment', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  equipmentId: {
    type: Sequelize.STRING(254),
    allowNull: true,
  },
  userID: {
    type: Sequelize.STRING(254),
    allowNull: true,
  },

});