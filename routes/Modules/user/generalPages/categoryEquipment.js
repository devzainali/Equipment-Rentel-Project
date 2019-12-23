const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Equipment = require('../../../../src/models/owner/equipments/equipments');
const Booked = require('../../../../src/models/requests/bookedRequest');
const Rating = require('../../../../src/models/owner/rating/rating');
const category = require('../../../../src/models/admin/categories/categories');
const subCategories = require('../../../../src/models/admin/categories/subcategories');

Equipment.hasMany(Rating, { as: "Ratingall", foreignKey: 'equipmentId' });

Equipment.belongsTo(category, { foreignKey: 'categoryId' })
Equipment.belongsTo(subCategories, { foreignKey: 'subCategoryId' })





router.get('/category/all', async (req, res) => {

    if (!req.query.catID) {
        res.status(403).json({
            error: "Validation Error",
            message: "catID is required",
        });

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
                        categoryId: req.query.catID,
                        id: { [Op.notIn]: BookObject },
                    },
                    attributes: ["id", "title", "image",],
                    include: [{ model: category, }, { model: subCategories }, { model: Rating, attributes: ["equipmentStar"] },],
                    order: [
                        ['id', 'DESC'],
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


router.get('/subCategory/all', async (req, res) => {

    if (!req.query.subCatID) {
        res.status(403).json({
            error: "Validation Error",
            message: "subCatID is required",
        });

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
                        subCategoryId: req.query.subCatID,
                        id: { [Op.notIn]: BookObject },
                    },
                    attributes: ["id", "title", "image",],
                    include: [{ model: category, }, { model: subCategories, }, { model: Rating, attributes: ["equipmentStar"] },],
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