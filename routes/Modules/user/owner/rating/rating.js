const express = require('express');
const router = express.Router();
const Rating = require('../../../../../src/models/owner/rating/rating');
const { validate } = require('../../../../../src/validations/owner/rating/rating');
const User = require('../../../../../src/models/user/user');
const Notification = require('../../../../../src/models/notification/notification');

// get rating
router.get('/', async (req, res) => {

    if (!req.query.ID) {
        res.status(403).json({
            status: false,
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    }

    Rating.findAndCountAll({
        where: {
            ownerId: req.query.ID
        },
        order: [
            ['id', 'DESC'],
        ],
        attributes: ["id", "ownerStar", "review"],
    }).then(Rating => {
        res.status(200).json({
            message: "Owner Rating",
            data: Rating
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });

});


// add rating
router.post('/', async (req, res) => {
    let renterName;
    const renterID = req.body.renterId;
    var rating = {
        "equipmentStar": req.body.equipmentStar,
        "ownerStar": req.body.ownerStar,
        "renterId": req.body.renterId,
        "equipmentId": req.body.equipmentId,
        "ownerId": req.body.ownerId,
        "review": req.body.review,
    }

    const { error } = validate(rating);
    if (error) {
        res.status(403).json({
            status: false,
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        createRating = Rating.create({
            "equipmentStar": req.body.equipmentStar,
            "ownerStar": req.body.ownerStar,
            "renterId": req.body.renterId,
            "equipmentId": req.body.equipmentId,
            "ownerId": req.body.ownerId,
            "review": req.body.review,
        }).then(function (Rating) {
            User.findOne({ where: { id: renterID }, attributes: ['firstName', 'lastName'] })
                .then(function (User) {
                    const fullname = User.firstName + '' + User.lastName;
                    const notification = fullname + ' gives you ' + Rating.ownerStar + ' stars and gives ' + Rating.equipmentStar + ' on you equipment.';
                    createNotification = Notification.create({
                        "userID": Rating.ownerId,
                        "Notification": notification,
                    }).then(function (Notification) {
                        res.status(200).json({
                            message: "Rating is Successfully Added",
                            data: Rating
                        });
                    }).catch(function (err) {
                        res.status(500).json({
                            message: err.message,
                            data: []
                        });
                    });
                }).catch(function (err) {
                    return err;
                });


        }).catch(function (err) {
            console.log('fail');
            res.status(500).json({
                message: err.message,
                data: []
            });
        });
    }

});

module.exports = router; 