const Sequelize = require('sequelize');


module.exports = sequelize.define('transaction', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: { //id
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    renterID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    ownerID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    payment_status: { //basicially jab payment capture karain ga state parameter is ma save karwain ga
        type: Sequelize.STRING(254),
        allowNull: true,
    },
    actualAmount: { //"amount": { "total": "72.00","currency": "USD"},
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    currency: {//"amount": { "total": "72.00","currency": "USD"},
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    transactionFee: {//"transaction_fee": { "value": "72.00","currency": "USD"},
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    equipmentID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    refund_url: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    created_time: {//create_time
        type: Sequelize.DATE,
        allowNull: false,
    },
    updated_time: { //update_time
        type: Sequelize.DATE,
        allowNull: false,
    },
});