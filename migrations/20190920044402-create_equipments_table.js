'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('equipments', {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: Sequelize.STRING(254),
                allowNull: false,
            },
            make: {
                type: Sequelize.STRING(254),
                allowNull: false,
            },
            model: {
                type: Sequelize.STRING(254),
                allowNull: true,
            },
            yearOfRegistration: {
                type: Sequelize.STRING(254),
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            mileage: {
                type: Sequelize.STRING(254),
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING(55),
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING(55),
                allowNull: true,
            },
            dailyRate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            weekelyRate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            monthelyRate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            image: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            categoryId: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            subCategoryId: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            ownerId: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            active: {
                type: Sequelize.INTEGER(54),
                allowNull: false,
                defaultValue: 0
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
        return queryInterface.dropTable('equipments');
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
    }
};
