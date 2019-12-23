const auth = require('../../../middleware/auth');
const ownerauth = require('../../../middleware/checkowner');
const { validate, validateUpdate, validatelogin, validateImage } = require('../../../src/validations/owner/owner');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/owner/');
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

const Owner = require('../../../src/models/owner/owner');
const Rating = require('../../../src/models/generalModules/rating/rating');
Owner.hasMany(Rating, { as: "Rating", foreignKey: 'ownerId' });

router.get('/me', [auth, ownerauth], async (req, res) => {

    Owner.findOne({ where: { id: req.user.ID, } })
        .then(function (Owner) {
            if (!Owner) {
                res.status(404).json({
                    message: "No Such Owner Exist",
                    data: []
                });
            }
            res.status(200).json({
                message: "Owner Details",
                data: Owner
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

});

//login
router.post('/login', async (req, res) => {
    var owners = {
        "email": req.body.email,
        "password": req.body.password,
    }
    const password = req.body.password;
    console.log(req.body);
    const { error } = validatelogin(owners);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        });
    }
    Owner.findOne({ where: { email: req.body.email } })
        .then(function (Owner) {

            bcrypt.compare(password, Owner.password, function (err, ress) {
                if (!ress) {
                    res.status(401).json({
                        message: "Email and password does not match"
                    });
                } else {
                    const token = jwt.sign({ ID: Owner.id, role: 'owner' }, config.get('jwtPrivateKey'));
                    res.status(200).json({
                        token: token,
                        message: "Successfully Login"
                    })
                }
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

});

//get rating
router.get('/rating', [auth, ownerauth], async (req, res) => {


    Owner.findAll(
        {
            where: { id: req.user.ID, },
            include: [{ model: Rating, as: "Rating", }]
        })
        .then(function (Owner) {
            for (var item in Owner.Rating) {
                let value = Owner.Rating[item]; // get the value by key
                console.log(value);
            }
            res.status(200).json({
                message: "Owner Rating",
                data: Owner
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

});


router.post('/', async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    var owners = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "contactNo": req.body.contactNo,
        "email": req.body.email,
        "country": req.body.country,
        "city": req.body.city,
        "address": req.body.address,
        "password": req.body.password,
    }

    const { error } = validate(owners);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {
        //inserting data in db
        Owner.findOrCreate({
            where: {
                email: req.body.email,
            },
            defaults: { // set the default properties if it doesn't exist
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "email": req.body.email,
                "contactNo": req.body.contactNo,
                "country": req.body.country,
                "city": req.body.city,
                "address": req.body.address,
                "password": password,
            }
        }).then(function (result) {
            var AcceptObject = result[0], // the instance of the author
                created = result[1]; // boolean stating if it was created or not

            if (!created) { // false if author already exists and was not created.
                res.status(302).json({
                    message: "Email address is already exist",
                    data: AcceptObject
                });
            }

            const token = jwt.sign({ ID: AcceptObject.id, role: 'owner' }, config.get('jwtPrivateKey'));
            res.status(200).header('x-auth-token', token).json({
                message: "Owner is Successfully registered",
                data: AcceptObject
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

    }

});

//updating owner
router.put('/', [auth, ownerauth], async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    let password = '';
    //check for id is comming in req or not
    if (req.body.password) {

        password = await bcrypt.hash(req.body.password, salt);
    }

    var owners = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "contactNo": req.body.contactNo,
        "country": req.body.country,
        "city": req.body.city,
        "address": req.body.address,
    }

    const { error } = validateUpdate(owners);
    if (error) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        //inserting data in db
        Owner.findOne({ where: { id: req.user.ID, } })
            .then(function (Owner) {


                if (!req.body.password) {
                    console.log(Owner.password);
                    ///return;
                    password = Owner.password;
                    //console.log('password doesnot comes');     
                }

                if (!Owner) {

                    res.status(404).json({
                        message: "No such Owner Found",
                        data: []
                    });

                }


                if (Owner) {
                    Owner.update({
                        "firstName": req.body.firstName,
                        "lastName": req.body.lastName,
                        "contactNo": req.body.contactNo,
                        "email": req.body.email,
                        "country": req.body.country,
                        "city": req.body.city,
                        "address": req.body.address,
                        "password": password,
                        "companyName": req.body.companyName,
                    })
                        .then(function (Owner) {
                            const token = jwt.sign({ ID: Owner.id, role: 'owner' }, config.get('jwtPrivateKey'));
                            res.status(200).header('x-auth-token', token).send({
                                message: "renter is Successfully updated",
                                data: Owner
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



//updating image of company
router.put('/updateImage', [auth, ownerauth], upload.single('Image'), async (req, res) => {

    console.log(req.file);
    let image = '';


    var owner = {
        "Image": req.file,
    }

    const { error } = validateImage(owner);
    if (error) {

        if (req.file) {
            //delete recently uploaded file
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
        Owner.findOne({ where: { id: req.user.ID, } })
            .then(function (Owner) {

                if (!Owner) {

                    res.status(404).json({
                        message: "No such Owner Found",
                        data: []
                    });

                }


                if (Owner) {
                    //check for images comes or not
                    if (!req.file) {
                        //console.log('file not comes');
                        image = Owner.image;
                    } else {
                        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                            let name = req.file.path;
                            image = name.replace("uploads\\", "");
                            // delete file named 
                            fs.unlink('uploads\\' + Owner.image, function (err) {
                                console.log('uploads\\' + Owner.image);
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
                    Owner.update({
                        "image": image
                    })
                        .then(function (Owner) {
                            res.status(200).json({
                                message: "Owner is Successfully updated",
                                data: Owner
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





module.exports = router; 