const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Equipment = require('../../../../src/models/owner/equipments/equipments');
const Accept = require('../../../../src/models/requests/acceptRequests');
const Booked = require('../../../../src/models/requests/bookedRequest');
const Pending = require('../../../../src/models/requests/pendingRequests');
const Rating = require('../../../../src/models/owner/rating/rating');
const Payout = require('../../../../src/models/owner/payout/payout');

Equipment.hasMany(Rating, { as: "allRating", foreignKey: 'equipmentId' });

router.get('/get', async (req, res) => {
    let page = 0;
    pageSize = 25;
    let RatedObject = [];
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

    var initializegetTopRated = getRatedequipment();
    initializegetTopRated.then(function (IDs) {

        if (IDs.ids.length > 0) {
            for (var i = 0; i < IDs.ids.length; i++) {
                RatedObject.push(IDs.ids[i]['equipmentId']);
            }

        }

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
                        id: { [Op.in]: RatedObject, [Op.notIn]: BookObject },
                    },
                    attributes: ["id", "title", "image", "dailyRate", "weekelyRate", "monthelyRate"],
                    include: [{ model: Rating, as: "allRating", attributes: ["equipmentStar",] },],
                    order: [
                        ['id', 'DESC',

                        ],
                    ],
                    distinct: true
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
                    message: "Equipmentss",
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


function getRatedequipment() {
    return new Promise(function (resolve, reject) {
        Rating.findAndCountAll(
            {

                attributes: ['equipmentId'],
                group: 'equipmentId',
            })
            .then(function (Rating) {
                Booked.findAndCountAll(
                    {
                        attributes: ['equipmentId'],
                    })
                    .then(function (Booked) {
                        var result = { "ids": Rating.rows, "booked": Booked.rows };
                        resolve(result);


                    }).catch(function (err) {
                        reject(err.message);
                    });
            }).catch(function (err) {
                reject(err.message);
            });
    }, function (err) {
        reject(err.message);
    });

}


function getBookedEquipment() {
    return new Promise(function (resolve, reject) {
        Booked.findAndCountAll(
            {
                attributes: ['equipmentId'],
            })
            .then(function (Booked) {
                var result = { "count": Booked.count, "ids": Booked.rows };
                resolve(result);
            });
    }, function (err) {
        reject(err.message);
    });

}


module.exports = router; 