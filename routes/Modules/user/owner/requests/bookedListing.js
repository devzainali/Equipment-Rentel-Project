var mysql = require('mysql');
const express = require('express');
const router = express.Router();
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');
const AcceptRequest = require('../../../../../src/models/requests/acceptRequests');
const Booked = require('../../../../../src/models/requests/bookedRequest');
const auth = require('../../../../../middleware/auth');
const checkOwner = require('../../../../../middleware/checkowner');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');
const User = require('../../../../../src/models/user/user')

Booked.belongsTo(Equipment, { foreignKey: 'equipmentId' });
Booked.belongsTo(User, { foreignKey: 'renterId' });

router.get('/', [auth, checkOwner], async (req, res) => {

    Booked.
        findAndCountAll(
            {
                where: {
                    ownerId: req.user.ID
                },
                include: [{ model: Equipment }, { model: User, attributes: ["id", "firstName", "lastName", "companyName", "address", "image"] }],
                order: [
                    ['id', 'DESC'],
                ],
                distinct: true
            })
        .then(function (Booked) {

            res.status(200).json({
                message: "Booked Requests",
                data: Booked,
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

});


module.exports = router; 