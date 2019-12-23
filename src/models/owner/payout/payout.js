const Sequelize = require('sequelize');


module.exports = sequelize.define('payout', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    transactionID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    payoutID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    payout_itemID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    payout_transactionID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    receiver_email: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    Amount: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    transactionFee: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    equipmentID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    created_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updated_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
});