const Sequelize = require('sequelize');

module.exports = sequelize.define('paypalcreditional', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    owner_id: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
});