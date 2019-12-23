const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const Expenses = require('../../../../../src/models/renter/renterExpence/renterExpense');
const Notification = require('../../../../../src/models/notification/notification');
const auth = require('../../../../../middleware/auth');
const checkRenter = require('../../../../../middleware/checkrenter');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');

const User = require('../../../../../src/models/user/user');

Expenses.belongsTo(Equipment, { foreignKey: 'equipmentId' });

router.get('/', [auth, checkRenter], async (req, res) => {


    Expenses.findAndCountAll({
        where: {
            renterID: req.user.ID
        },
        include: [{ model: Equipment }],
        order: [
            ['id', 'DESC'],
        ],
    }).then(Expenses => {
        res.status(200).json({
            message: "Expenses Listing",
            data: Expenses
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });

});

module.exports = router; 