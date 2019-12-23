const config = require('config');

var Sequelize = require('sequelize');
const Op = Sequelize.Op

const express = require('express');
const router = express.Router();

const Equipment = require('../../../../../src/models/owner/equipments/equipments');
const Accept = require('../../../../../src/models/requests/acceptRequests');
const Pending = require('../../../../../../src/models/requests/pendingRequests');
const Booked = require('../../../../../src/models/requests/bookedRequest');

// Equipment.hasOne(Booked,{as:"Booked",foreignKey: 'equipmentId'});
// Equipment.hasMany(Pending,{as:"Pending",foreignKey: 'equipmentId'});

//Booked.belongsTo(User,{as:"renter",foreignKey: 'renterId'});
//get overall equipment
router.get('/all', async (req, res) => {
    let bookedObject;
    let page = 0;
    pageSize = 25;

    if (req.query.page) {
        page = req.query.page;

    }
    const offset = page * pageSize;
    const limit = offset + pageSize;
    if (req.query.reqpage) {
        reqpage = req.query.reqpage;
    }
    var initializegetFollowers = getBookedEquipment();
    initializegetFollowers.then(function (BookedIDs) {

        if (BookedIDs.count > 0) {
            bookedObject = [];
            for (var i = 0; i < BookedIDs.ids.length; i++) {
                bookedObject.push(BookedIDs.ids[i]['equipmentId']);
            }
            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            id: { [Op.notIn]: bookedObject },
                            active: 0,
                        },
                        order: [
                            ['id', 'DESC'],
                        ],
                        distinct: true
                        // include:[{model:Booked,as:"Booked"},{model:Pending,as:"Pending"}],

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


        } else {

            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            //id: {[Op.notIn]:[1,2]},
                            active: 0,
                        },
                        // include:[{model:Booked,as:"Booked"},{model:Pending,as:"Pending"}],

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
                        message: "Equipment",
                        data: Equipment,
                        paginationPages: value
                    });

                }).catch(function (err) {
                    res.status(500).json({
                        message: "Some error occur",
                        data: err.message
                    });
                });

        }

    }, function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    })


});


//owner available equipments
//get overall equipment
router.get('/get/available', async (req, res) => {

    if (!req.query.ownerID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "ownerID is required"
        })
    }

    let bookedObject;
    let page = 0;
    pageSize = 25;

    if (req.query.page) {
        page = req.query.page;

    }
    const offset = page * pageSize;
    const limit = offset + pageSize;
    if (req.query.reqpage) {
        reqpage = req.query.reqpage;
    }
    var initializegetFollowers = getBookedEquipment();
    initializegetFollowers.then(function (BookedIDs) {

        if (BookedIDs.count > 0) {
            bookedObject = [];
            for (var i = 0; i < BookedIDs.ids.length; i++) {
                bookedObject.push(BookedIDs.ids[i]['equipmentId']);
            }
            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            id: { [Op.notIn]: bookedObject },
                            active: 0,
                            ownerId: req.query.ownerID
                        },
                        order: [
                            ['id', 'DESC'],
                        ],

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
                        message: "owner Available Equipment",
                        data: Equipment,
                        paginationPages: value
                    });

                }).catch(function (err) {
                    res.status(500).json({
                        message: "Some error occur",
                        data: err.message
                    });
                });


        } else {

            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            //id: {[Op.notIn]:[1,2]},
                            active: 0,
                        },
                        order: [
                            ['id', 'DESC'],
                        ],
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
                        message: "Equipment",
                        data: Equipment,
                        paginationPages: value
                    });

                }).catch(function (err) {
                    res.status(500).json({
                        message: "Some error occur",
                        data: err.message
                    });
                });

        }

    }, function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    })


});



//ends here


//get overall specfic sub category equipment
router.get('/subcategory', async (req, res) => {


    if (req.body.Category) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "category parameter is missing"
        })

    }

    let bookedObject;
    let page = 0;
    pageSize = 25;
    if (req.query.page) {
        page = req.query.page;

    }
    const offset = page * pageSize;
    const limit = offset + pageSize;
    if (req.query.reqpage) {
        //console.log(req.query);
        reqpage = req.query.reqpage;
    }
    var initializegetFollowers = getBookedEquipment();
    initializegetFollowers.then(function (BookedIDs) {

        if (BookedIDs.count > 0) {
            bookedObject = [];
            for (var i = 0; i < BookedIDs.ids.length; i++) {
                bookedObject.push(BookedIDs.ids[i]['equipmentId']);
            }
            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            id: { [Op.notIn]: bookedObject },
                            active: 0,
                            categoryId: req.query.Category
                        },
                        order: [
                            ['id', 'DESC'],
                        ],

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
                        message: "Equipment",
                        data: Equipment,
                        paginationPages: value
                    });

                }).catch(function (err) {
                    res.status(500).json({
                        message: "Some error occur",
                        data: err.message
                    });
                });


        } else {

            Equipment.
                findAndCountAll(
                    {
                        limit,
                        offset,
                        where: {
                            //id: {[Op.notIn]:[1,2]},
                            active: 0,
                        },
                        order: [
                            ['id', 'DESC'],
                        ],

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
                        message: "Equipment",
                        data: Equipment,
                        paginationPages: value
                    });

                }).catch(function (err) {
                    res.status(500).json({
                        message: "Some error occur",
                        data: err.message
                    });
                });

        }


    }, function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    })


});





// function getBookedEquipment() {
//     return new Promise(function (resolve, reject) {
//         Accept.findAndCountAll(
//             {
//                 attributes: ['equipmentId'],
//             })
//             .then(function (Accept) {
//                 var result = { "count": Accept.count, "ids": Accept.rows };
//                 resolve(result);
//             });
//     }, function (err) {
//         reject(err.message);
//     });

// }


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