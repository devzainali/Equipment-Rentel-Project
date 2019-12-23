const express = require('express');
const router = express.Router();

const Equipment = require('../../../../src/models/owner/equipments/equipments');

const User = require('../../../../src/models/user/user');

const Rating = require('../../../../src/models/owner/rating/rating');
const Booked = require('../../../../src/models/requests/bookedRequest');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Equipment.belongsTo(User, { as: "owner", foreignKey: 'ownerId' });
User.hasMany(Equipment, { foreignKey: 'ownerId' })
User.hasMany(Rating, { foreignKey: 'ownerId', })
Rating.belongsTo(User, { foreignKey: 'renterId' });
Equipment.hasMany(Rating, { foreignKey: 'equipmentId' });



router.get('/', async (req, res) => {
    let BookObject = [];

    if (!req.query.ID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "ID is required"
        })

    }
    var initializegetTopRated = getBookedEquipment();
    initializegetTopRated.then(function (IDs) {
        //inserting data in db
        if (IDs.booked.length > 0) {
            for (var i = 0; i < IDs.booked.length; i++) {
                BookObject.push(IDs.booked[i]['equipmentId']);
            }
        }


        User.findOne({
            where: { id: req.query.ID, },
            include: [{
                model: Rating, include: [{
                    model: User, attributes: ["id", "firstName", "lastName", "image"]
                }]
            }, {
                model: Equipment, include: [{ model: Rating }], where: {
                    id: { [Op.notIn]: BookObject },
                    active: 0,

                },
            }],
            order: [
                [{ model: Rating, }, 'id', 'DESC'],
                [
                    { model: Equipment, }, 'id', 'DESC']
            ],
            distinct: true
        })
            .then(function (Equipment) {

                if (!Equipment) {
                    res.status(404).json({
                        message: "No such Equipment Exist to update",
                        data: []
                    });
                }

                // Check if record exists in db
                if (Equipment) {
                    res.status(200).json({
                        message: "Equipment Detail",
                        data: Equipment
                    });
                }
            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });



    }, function (err) {
        res.status(500).json({
            message: "Some error occurs",
            data: err.message
        });
    })



});
//get 



function getBookedEquipment() {
    return new Promise(function (resolve, reject) {
        Booked.findAndCountAll(
            {
                attributes: ['equipmentId'],
            })
            .then(function (Booked) {
                var result = { "count": Booked.count, "booked": Booked.rows };
                resolve(result);
            });
    }, function (err) {
        reject(err.message);
    });

}


module.exports = router; 