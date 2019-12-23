const Sequelize = require('sequelize');


module.exports = sequelize.define('rating', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    equipmentStar: {
        type: Sequelize.DOUBLE(53),
        allowNull: false,
    },
    ownerStar: {
        type: Sequelize.DOUBLE(53),
        allowNull: false,
    },
    renterId: {
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
    review: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});