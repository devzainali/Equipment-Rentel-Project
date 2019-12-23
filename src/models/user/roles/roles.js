const Sequelize = require('sequelize');

module.exports = Sequelize.define('roles', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },

});