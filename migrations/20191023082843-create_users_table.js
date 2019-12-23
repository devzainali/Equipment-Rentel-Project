'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING(254),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(254),
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING(254),
        allowNull: true,
      },
      contactNo: {
        type: Sequelize.STRING(254),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(254),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(254),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(254),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(254),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      hash: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    return queryInterface.dropTable('users');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
