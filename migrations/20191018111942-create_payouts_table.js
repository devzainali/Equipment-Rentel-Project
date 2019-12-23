'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payouts', {
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
    return queryInterface.dropTable('payouts');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
