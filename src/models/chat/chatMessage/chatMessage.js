const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('chatmessage', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    conversationID: {
        type: Sequelize.STRING(254),//Account type Company:1,Account Type jobSeeker:2  
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
    senderID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    receiverID: {
        type: Sequelize.STRING(254),
        allowNull: false,
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false,
    },

});