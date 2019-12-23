const Sequelize = require('sequelize');
const Joi = require('joi');


module.exports = sequelize.define('conversation', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    renterID: {
        type: Sequelize.STRING(254),//Account type Company:1,Account Type jobSeeker:2  
        allowNull: false,
    },
    ownerID: {
        type: Sequelize.STRING(254),// NewJob/Connection/Follow/Chat/
        allowNull: false,
    },

});