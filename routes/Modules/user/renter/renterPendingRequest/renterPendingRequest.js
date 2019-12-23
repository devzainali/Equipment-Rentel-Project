const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');
const Notification = require('../../../../../src/models/notification/notification');
const auth = require('../../../../../middleware/auth');
const checkRenter = require('../../../../../middleware/checkrenter');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');

const User = require('../../../../../src/models/user/user');

PendingRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });
PendingRequest.belongsTo(User, { foreignKey: 'ownerId' });

router.get('/', [auth, checkRenter], async (req, res) => {


    PendingRequest.findAndCountAll({
        where: {
            renterId: req.user.ID
        },
        include: [{ model: Equipment }, { model: User }],
        order: [
            ['id', 'DESC'],
        ],
    }).then(PendingRequest => {
        res.status(200).json({
            message: "PEnding Requests Listing",
            data: PendingRequest
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });

});

module.exports = router; 