const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('notification', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    // ownerId:{
    //     type:Sequelize.STRING(254),
    //     allowNull:true,
    // },
    // renterId:{
    //     type:Sequelize.STRING(254),
    //     allowNull:true,
    // },
    Notification: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    isRead: {
        type: Sequelize.INTEGER(11),
        defaultValue: 0
    },

});