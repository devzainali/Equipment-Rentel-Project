const Sequelize = require('sequelize');


module.exports = sequelize.define('bookedrequest', {
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
    equipmentId: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    ownerId: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    renterId: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    location: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    totalweeks: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    totalMonths: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    totalDays: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    overAllDays: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    total: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    deployment_status: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    //transactionID
});