const auth = require('../../../../../../middleware/auth');
const ownerauth = require('../../../../../../middleware/checkowner');
const config = require('config');

var Sequelize = require('sequelize');
const Op = Sequelize.Op

const express = require('express');
const router = express.Router();

const Equipment = require('../../../../../../src/models/owner/equipments/equipments');
const Accept = require('../../../../../../src/models/requests/acceptRequests');

const Booked = require('../../../../../../src/models/requests/bookedRequest');




//get overall equipment
router.get('/activeEquipment', [auth, ownerauth], async (req, res) => {
    Equipment.
        findAndCountAll(
            {

                where: {
                    active: 0,
                    ownerId: req.user.ID
                },
                order: [
                    ['id', 'DESC'],
                ],
                //distinct: true

            })
        .then(function (Equipment) {


            res.status(200).json({
                message: "Equipment",
                data: Equipment,
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });


});










function getBookedEquipment() {
    return new Promise(function (resolve, reject) {
        Booked.findAndCountAll(
            {
                attributes: ['equipmentId'],
            })
            .then(function (Booked) {
                var result = { "count": Booked.count, "ids": Booked.rows };
                resolve(result);
            }).catch(function (err) {
                reject(err.message);
            });
    }, function (err) {
        reject(err.message);
    });

}



module.exports = router; 