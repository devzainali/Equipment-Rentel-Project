const Sequelize = require('sequelize');

module.exports = sequelize.define('userroles', {

  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  roleID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
})