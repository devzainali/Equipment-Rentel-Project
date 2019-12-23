const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const AcceptRequest = require('../../../../../src/models/requests//acceptRequests');
const Notification = require('../../../../../src/models/notification/notification');
const auth = require('../../../../../middleware/auth');
const checkRenter = require('../../../../../middleware/checkrenter');

const User = require('../../../../../src/models/user/user');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');
AcceptRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });
AcceptRequest.belongsTo(User, { foreignKey: 'renterId' });


router.get('/', [auth, checkRenter], async (req, res) => {


    AcceptRequest.findAndCountAll({
        where: {
            renterId: req.user.ID
        },
        include: [{ model: Equipment }, { model: User, attributes: ["id", "firstName", "lastName", "companyName", "address", "image"] }],
        order: [
            ['id', 'DESC'],
        ],
    }).then(AcceptRequest => {
        res.status(200).json({
            message: "Accept Requests Listing",
            data: AcceptRequest
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });

});

module.exports = router; 