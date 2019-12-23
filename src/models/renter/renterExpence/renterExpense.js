const Sequelize = require('sequelize');

module.exports = sequelize.define('renterexpence', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    TransactionID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    renterID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    equipmentID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },

});