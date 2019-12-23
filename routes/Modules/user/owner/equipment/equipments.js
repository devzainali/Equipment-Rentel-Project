const auth = require('../../../../../middleware/auth');
const ownerauth = require('../../../../../middleware/checkowner');
const { validate, validateUpdate, validateUpdateStatuss } = require('../../../../../src/validations/owner/equipment/equipment');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var fs = require('fs');
var Sequelize = require('sequelize');
const Op = Sequelize.Op

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/user/equipments/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);

    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
//const connection = require('../../startup/db');
var mysql = require('mysql');

const express = require('express');
const router = express.Router();

const Equipment = require('../../../../../src/models/owner/equipments/equipments');
const Accept = require('../../../../../src/models/requests/acceptRequests');
const Booked = require('../../../../../src/models/requests/bookedRequest');
const Pending = require('../../../../../src/models/requests/pendingRequests');
const Rating = require('../../../../../src/models/owner/rating/rating');
const Payout = require('../../../../../src/models/owner/payout/payout');


Equipment.hasOne(Booked, { foreignKey: 'equipmentId' });
Equipment.hasMany(Pending, { foreignKey: 'equipmentId' });
Equipment.hasMany(Rating, { foreignKey: 'equipmentId' });
Equipment.hasMany(Payout, { foreignKey: 'equipmentID', targetKey: 'equipmentID', });



router.post('/', upload.single('image'), [auth, ownerauth], async (req, res) => {

    let image = '';
    var equipment = {
        "title": req.body.title,
        "make": req.body.make,
        "model": req.body.model,
        "yearOfRegistration": req.body.yearOfRegistration,
        "description": req.body.description,
        "mileage": req.body.mileage,
        "dailyRate": req.body.dailyRate,
        "weekelyRate": req.body.weekelyRate,
        "monthelyRate": req.body.monthelyRate,
        "image": req.body.Image,
        "categoryId": req.body.categoryId,
        "subCategoryId": req.body.subCategoryId,
        "country": req.body.country,
        "city": req.body.city,
        "address": req.body.address,
    }

    const { error } = validate(equipment);
    if (error) {

        if (req.file) {
            //delete recently deleted file
            if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                // delete file named 
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }


        }

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {
        if (req.file) {
            let name = req.file.path;
            image = name.replace("uploads/", "");
        }
        //inserting data in db
        const createEquipment = Equipment.create({
            "title": req.body.title,
            "make": req.body.make,
            "model": req.body.model,
            "yearOfRegistration": req.body.yearOfRegistration,
            "description": req.body.description,
            "mileage": req.body.mileage,
            "dailyRate": req.body.dailyRate,
            "weekelyRate": req.body.weekelyRate,
            "monthelyRate": req.body.monthelyRate,
            "image": image,
            "categoryId": req.body.categoryId,
            "subCategoryId": req.body.subCategoryId,
            "ownerId": req.user.ID,
            "country": req.body.country,
            "city": req.body.city,
            "address": req.body.address,
        }).then(function (createEquipment) {
            res.status(200).json({
                message: "Equipment is Successfully Added",
                data: createEquipment
            });

        }).catch(function (err) {
            if (req.file) {
                //delete recently deleted file
                if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                    // delete file named 
                    fs.unlink(req.file.path, function (err) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        console.log('File deleted!');
                    });
                }
            }

            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

    }

});
//updating equipment
//updating owner
router.put('/', upload.single('image'), [auth, ownerauth], async (req, res) => {


    let image = '';
    var equipment = {
        "title": req.body.title,
        "make": req.body.make,
        "model": req.body.model,
        "yearOfRegistration": req.body.yearOfRegistration,
        "description": req.body.description,
        "mileage": req.body.mileage,
        "dailyRate": req.body.dailyRate,
        "weekelyRate": req.body.weekelyRate,
        "monthelyRate": req.body.monthelyRate,
        "image": req.body.image,
        "categoryId": req.body.categoryId,
        "subCategoryId": req.body.subCategoryId,
        "country": req.body.country,
        "city": req.body.city,
        "address": req.body.address,
        "ID": req.body.ID
    }

    const { error } = validateUpdate(equipment);

    if (error) {
        if (req.file) {
            console.log('true');
            //delete recently deleted file
            if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                // delete file named 
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }
        }


        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        //inserting data in db
        Equipment.findOne({ where: { id: req.body.ID, } })
            .then(function (Equipment) {

                // Check accident password update
                if (!Equipment.id) {
                    res.status(404).json({
                        message: "No such Equipment Exist to update",
                        data: []
                    });
                }

                // Check if record exists in db
                if (Equipment) {
                    //check for images comes or not
                    if (!req.file) {
                        //console.log('file not comes');
                        image = Equipment.image;
                    } else {
                        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                            let name = req.file.path;
                            image = name.replace("uuploads/", "");
                            // delete file named 
                            fs.unlink('uploads/' + Equipment.image, function (err) {
                                console.log('uploads/' + Equipment.image);
                                if (err) {
                                    console.log('File NOT deleted!');
                                }
                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                            });
                        } else {
                            res.status(403).json({
                                message: "Validation error occur",
                                error: 'only These Types of images accepted here( jpeg|png|jpg )'
                            });
                        }

                    }
                    //check for images comes or not
                    Equipment.update({
                        "title": req.body.title,
                        "make": req.body.make,
                        "model": req.body.model,
                        "yearOfRegistration": req.body.yearOfRegistration,
                        "description": req.body.description,
                        "mileage": req.body.mileage,
                        "dailyRate": req.body.dailyRate,
                        "weekelyRate": req.body.weekelyRate,
                        "monthelyRate": req.body.monthelyRate,
                        "image": image,
                        "categoryId": req.body.categoryId,
                        "subCategoryId": req.body.subCategoryId,
                        "country": req.body.country,
                        "city": req.body.city,
                        "address": req.body.address,
                    })
                        .then(function (owner) {
                            res.status(200).json({
                                message: "Equipment is Successfully updated",
                                data: owner
                            });

                        })
                }
            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });

    }

    ///

});
//get overall equipment of owner
router.get('/all', [auth, ownerauth], async (req, res) => {
    console.log(req.user);
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

    Equipment.
        findAndCountAll(
            {
                limit,
                offset,
                where: {
                    //active: 0,
                    ownerId: req.user.ID
                },
                attributes: ["id", "title", "image", "active"],
                include: [{ model: Booked }, { model: Pending }, { model: Rating, group: 'id' }, { model: Payout, attributes: ["Amount"] }],
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

});
//get overall specfic sub category equipment
router.get('/category', [auth, ownerauth], async (req, res) => {
    let TotalPages;
    let TotalRecords;

    let reqpage = 0;
    let pageSize = 2;
    const offset = reqpage * pageSize;
    const limit = offset + pageSize;
    Equipment
        .findAndCountAll({
            where: {
                categoryId: req.query.catId,
                ownerId: req.user.ID
            },
            order: [
                ['id', 'DESC'],
            ],
            limit,
            offset,
        })
        .then(result => {
            TotalRecords = result.count;
            TotalPages = result.count / limit;

        });
    if (req.query.reqpage) {
        console.log('reqpage  comes');
        console.log(req.query);
        reqpage = req.query.reqpage;
    }

    Equipment.findAndCountAll(
        {
            where: { categoryId: req.query.catId, },
            limit,
            offset,
        })
        .then(function (Equipment) {

            let value;
            let paginationValues = Math.round(Equipment.count / pageSize) - 1;
            if (paginationValues > 2) {
                value = paginationValues
            } else {
                value = 0;
            }



            res.json({
                status: 200,
                message: "Equipment",
                data: Equipment,
                totalRecord: TotalRecords,
                paginationPages: value,
            });

        }).catch(function (err) {
            res.json({
                status: 200,
                message: "Some problem occur",
                data: []
            });
        });

});

//get overall specfic sub category equipment
router.get('/subcategory', [auth, ownerauth], async (req, res) => {
    let TotalPages;
    let TotalRecords;

    let reqpage = 0;
    let pageSize = 2;
    const offset = reqpage * pageSize;
    const limit = offset + pageSize;
    Equipment
        .findAndCountAll({
            where: {
                subCategoryId: req.query.catId,
                ownerId: req.user.ID
            },
            order: [
                ['id', 'DESC'],
            ],
            limit,
            offset,
        })
        .then(result => {
            TotalRecords = result.count;
            TotalPages = result.count / limit;

        });
    if (req.query.reqpage) {
        console.log('reqpage  comes');
        console.log(req.query);
        reqpage = req.query.reqpage;
    }

    Equipment.findAndCountAll(
        {
            where: { categoryId: req.query.catId, },
            limit,
            offset,
        })
        .then(function (Equipment) {

            let value;
            let paginationValues = Math.round(Equipment.count / pageSize) - 1;
            if (paginationValues > 2) {
                value = paginationValues
            } else {
                value = 0;
            }



            res.json({
                status: 200,
                message: "Equipment",
                data: Equipment,
                totalRecord: TotalRecords,
                paginationPages: value,
            });

        }).catch(function (err) {
            res.json({
                status: 200,
                message: "Some problem occur",
                data: []
            });
        });

});


//update equipment status
router.put('/updateStatus', [auth, ownerauth], async (req, res) => {


    var equipment = {
        "active": req.body.status,
        "ID": req.body.ID
    }

    const { error } = validateUpdateStatuss(equipment);

    if (error) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        //inserting data in db
        Equipment.findOne({ where: { id: req.body.ID, } })
            .then(function (Equipment) {

                // Check accident password update
                if (!Equipment.id) {
                    res.status(404).json({
                        message: "No such Equipment Exist to update",
                        data: []
                    });
                }

                // Check if record exists in db
                if (Equipment) {
                    //check for images comes or not
                    //check for images comes or not
                    Equipment.update({
                        "active": req.body.status,
                    })
                        .then(function (Equipment) {
                            res.status(200).json({
                                message: "Equipment is Successfully updated",
                                data: Equipment
                            });

                        })
                }
            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });

    }






});
//get 



function getBookedEquipment() {
    return new Promise(function (resolve, reject) {
        Accept.findAndCountAll(
            {
                attributes: ['equipmentId'],
            })
            .then(function (Accept) {
                var result = { "count": Accept.count, "ids": Accept.rows };
                resolve(result);
            });
    }, function (err) {
        reject(err.message);
    });

}



module.exports = router; 