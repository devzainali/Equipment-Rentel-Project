'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chatmessages', {
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
        type: Sequelize.STRING(254),// NewJob/Connection/Follow/Chat/
        allowNull: false,
      },
      ownerID: {
        type: Sequelize.STRING(254),// NewJob/Connection/Follow/Chat/
        allowNull: false,
      },
      senderID: {
        type: Sequelize.STRING(254),// NewJob/Connection/Follow/Chat/
        allowNull: false,
      },
      receiverID: {
        type: Sequelize.STRING(254),// NewJob/Connection/Follow/Chat/
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,// NewJob/Connection/Follow/Chat/
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('chatmessages');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
