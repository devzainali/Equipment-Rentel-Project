'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      equipmentStar: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      ownerStar: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      renterId: {
        type: Sequelize.STRING,
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
      review: {
        type: Sequelize.TEXT,
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
    return queryInterface.dropTable('ratings');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
