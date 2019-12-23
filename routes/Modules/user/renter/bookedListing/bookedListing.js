const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const Booked = require('../../../../../src/models/requests/bookedRequest');
const Notification = require('../../../../../src/models/notification/notification');
const auth = require('../../../../../middleware/auth');
const checkRenter = require('../../../../../middleware/checkrenter');
const Equipment = require('../../../../../src/models/owner/equipments/equipments')
const User = require('../../../../../src/models/user/user');

Booked.belongsTo(Equipment, { foreignKey: 'equipmentId' });
Booked.belongsTo(User, { foreignKey: 'renterId' });


router.get('/', [auth, checkRenter], async (req, res) => {


    Booked.findAndCountAll({
        where: {
            renterId: req.user.ID
        },
        include: [{ model: Equipment }, { model: User, attributes: ["id", "firstName", "lastName", "companyName", "address", "image"] }],
        order: [
            ['id', 'DESC'],
        ],
    }).then(Booked => {
        res.status(200).json({
            message: "Booked Equipment Listing",
            data: Booked
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });

});

module.exports = router; 