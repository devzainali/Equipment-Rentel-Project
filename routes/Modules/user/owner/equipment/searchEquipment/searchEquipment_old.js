const express = require('express');
const router = express.Router();

const Equipment = require('../../../../../../src/models/owner/equipments/equipments');

const User = require('../../../../../../src/models/user/user');

const Rating = require('../../../../../../src/models/owner/rating/rating');
const Booked = require('../../../../../../src/models/requests/bookedRequest');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



Equipment.belongsTo(User, { as: "Poster", foreignKey: 'ownerId' });
// User.hasMany(Equipment,{as:"otherEquipments",foreignKey: 'ownerId'})
Equipment.hasMany(Rating, { as: "RatingsReviews", foreignKey: 'ownerId', })



router.get('/', async (req, res) => {

    if (!req.query.keyword) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "keyword is required"
        })

    }

    let page = 0;
    pageSize = 25;
    let BookObject = [];
    if (req.query.page) {
        page = req.query.page;

    }
    const offset = page * pageSize;
    const limit = offset + pageSize;
    if (req.query.reqpage) {
        //console.log(req.query);
        reqpage = req.query.reqpage;
    }

    var initializegetTopRated = getBookedEquipment();
    initializegetTopRated.then(function (IDs) {

        if (IDs.booked.length > 0) {
            for (var i = 0; i < IDs.booked.length; i++) {
                BookObject.push(IDs.booked[i]['equipmentId']);
            }
        }

        Equipment.
            findAndCountAll(
                {
                    limit,
                    offset,
                    where: {
                        active: 0,
                        title: { [Op.like]: '%' + req.query.keyword + '%' },
                        id: { [Op.notIn]: BookObject },
                    },
                    //attributes:["id","title","image",],
                    include: [{ model: User, as: "Poster" }, { model: Rating, as: "RatingsReviews", attributes: ["equipmentStar"] },],
                    order: [
                        [
                            { model: Rating, as: "RatingsReviews" },
                            'id', 'DESC'],
                    ],
                    distinct: true
                    // raw:true
                })
            .then(function (Equipment) {

                let value;
                let paginationValues = Math.round(Equipment.count / pageSize) - 1;
                if (paginationValues > 2) {
                    value = paginationValues
                } else {
                    value = 0;
                }

                res.status(200).json({
                    message: "Equipments",
                    data: Equipment,
                    paginationPages: value
                });

            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });



    }, function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    })


});

router.post('/advanced', async (req, res) => {

    let condition;
    if (!req.query.keyword) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "keyword is required"
        })

    }
    if (!req.body.price) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "price is required"
        })

    }
    if (!req.body.priceType) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "priceType is required"
        })

    }



    let page = 0;
    pageSize = 25;
    let BookObject = [];
    if (req.query.page) {
        page = req.query.page;

    }
    const offset = page * pageSize;
    const limit = offset + pageSize;
    if (req.query.reqpage) {
        //console.log(req.query);
        reqpage = req.query.reqpage;
    }

    var initializegetTopRated = getBookedEquipment();
    initializegetTopRated.then(function (IDs) {

        if (IDs.booked.length > 0) {
            for (var i = 0; i < IDs.booked.length; i++) {
                BookObject.push(IDs.booked[i]['equipmentId']);
            }
        }
        if (!req.body.location) {

            if (req.body.priceType == 'Daily') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        dailyRate: { [Op.like]: '%' + req.body.price + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }

            if (req.body.priceType == 'weekely') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        weekelyRate: { [Op.like]: '%' + req.body.price + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }

            if (req.body.priceType == 'monthely') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        monthelyRate: { [Op.like]: '%' + req.body.price + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }
        } else {
            if (req.body.priceType == 'Daily') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        dailyRate: { [Op.like]: '%' + req.body.price + '%' },
                        dailyRate: { [Op.lte]: req.query.price },
                    }, {
                        city: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        country: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        address: { [Op.like]: '%' + req.body.location + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }
            if (req.body.priceType == 'weekely') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        weekelyRate: { [Op.like]: '%' + req.body.price + '%' },
                        weekelyRate: { [Op.lte]: req.query.price },
                    }, {
                        city: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        country: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        address: { [Op.like]: '%' + req.body.location + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }
            if (req.body.priceType == 'monthely') {
                condition = {
                    title: { [Op.like]: '%' + req.query.keyword + '%' },
                    [Op.or]: [{
                        monthelyRate: { [Op.like]: '%' + req.body.price + '%' },
                        monthelyRate: { [Op.lte]: req.query.price },
                    }, {
                        city: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        country: { [Op.like]: '%' + req.body.location + '%' }
                    }, {
                        address: { [Op.like]: '%' + req.body.location + '%' }
                    },
                    ],
                    active: 0,
                    id: { [Op.notIn]: BookObject },
                }
            }

        }

        Equipment.
            findAndCountAll(
                {
                    limit,
                    offset,
                    where: condition,
                    include: [{ model: User, as: "Poster" }, { model: Rating, as: "RatingsReviews", attributes: ["equipmentStar"] },],
                    order: [
                        ['id', 'DESC'],
                    ],
                    distinct: true
                    // raw:true
                })
            .then(function (Equipment) {

                let value;
                let paginationValues = Math.round(Equipment.count / pageSize) - 1;
                if (paginationValues > 2) {
                    value = paginationValues
                } else {
                    value = 0;
                }

                res.status(200).json({
                    message: "Equipments",
                    data: Equipment,
                    paginationPages: value
                });

            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });



    }, function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    })


});






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