const auth = require('../../../middleware/auth');
const ownerauth = require('../../../middleware/checkowner');
const { validate, validateUpdate, validatelogin, validateImage, validateChangeLogin } = require('../../../src/validations/user/user');
const User = require('../../../src/models/user/user');
const UserRole = require('../../../src/models/user/userRoles/userRoles');
const Rating = require('../../../src/models/owner/rating/rating');
const Equipment = require('../../../src/models/owner/equipments/equipments');
const Booked = require('../../../src/models/requests/bookedRequest');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
var fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/user/');
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

const express = require('express');
const router = express.Router();


User.hasOne(UserRole, { as: "role", foreignKey: 'userID' })
User.hasMany(Rating, { as: "Ratings", foreignKey: 'ownerId' });
User.hasMany(Equipment, { as: "EquipmentListings", foreignKey: 'ownerId' });

//Register User
router.post('/register', async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    var user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "contactNo": req.body.contactNo,
        "address": req.body.address,
        "companyName": req.body.companyName,
        "email": req.body.email,
        "password": req.body.password,
        "roleID": req.body.roleID
    }

    const { error } = validate(user);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {
        //inserting data in db
        User.findOrCreate({
            where: {
                email: req.body.email,
            },
            defaults: { // set the default properties if it doesn't exist
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "contactNo": req.body.contactNo,
                "address": req.body.address,
                "companyName": req.body.companyName,
                "email": req.body.email,
                "password": password,
            }
        }).then(function (result) {
            var AcceptObject = result[0], // the instance of the User
                created = result[1]; // boolean stating if it was created or not

            if (!created) { // false if user already exists and was not created.
                res.status(302).json({
                    message: "Email address is already exist",
                    data: AcceptObject
                });
            } else {

                //create user entry in roles table
                var createRoleUser = createUserRole(AcceptObject.id, req.body.roleID);
                createRoleUser.then(function (Response) {

                    const token = jwt.sign({ ID: AcceptObject.id, }, config.get('jwtPrivateKey'));
                    res.status(200).header('x-auth-token', token).json({
                        message: "Successfully registered",
                        data: AcceptObject
                    });

                }, function (err) {

                    res.status(403).json({
                        message: "Problem occur",
                        data: err.message
                    });

                });

            }




        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });

    }

});

//registering User


//updating owner
router.put('/Update', [auth], async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    let password = '';
    //check for id is comming in req or not
    if (req.body.password) {

        password = await bcrypt.hash(req.body.password, salt);
    }

    var user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "contactNo": req.body.contactNo,
        "address": req.body.address,
        "companyName": req.body.companyName,
        "country": req.body.country,
        "city": req.body.city,
        "about": req.body.about,
    }

    const { error } = validateUpdate(user);
    if (error) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        //inserting data in db
        User.findOne({ where: { id: req.user.ID, } })
            .then(function (User) {
                if (!req.body.password) {
                    password = User.password;
                }
                if (!User) {
                    res.status(404).json({
                        message: "No such user Found",
                        data: []
                    });
                }
                if (User) {
                    User.update({
                        "firstName": req.body.firstName,
                        "lastName": req.body.lastName,
                        "contactNo": req.body.contactNo,
                        "address": req.body.address,
                        "companyName": req.body.companyName,
                        "email": req.body.email,
                        "password": password,
                        "country": req.body.country,
                        "city": req.body.city,
                        "about": req.body.about,
                    })
                        .then(function (User) {
                            res.status(200).send({
                                message: "Successfully updated",
                                data: User
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

//updating image of user
router.put('/updateImage', auth, upload.single('Image'), async (req, res) => {

    let image = '';
    var user = {
        "Image": req.file,
    }

    const { error } = validateImage(user);
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
        User.findOne({ where: { id: req.user.ID, } })
            .then(function (User) {

                if (!User) {

                    res.status(404).json({
                        message: "No such User Found",
                        data: []
                    });

                }


                if (User) {
                    //check for images comes or not
                    if (!req.file) {
                        //console.log('file not comes');
                        image = User.image;
                    } else {
                        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                            let name = req.file.path;
                            image = name.replace("uploads/", "");
                            // delete file named 
                            fs.unlink('uploads/' + User.image, function (err) {
                                console.log('uploads/' + User.image);
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
                    User.update({
                        "image": image
                    })
                        .then(function (User) {
                            res.status(200).json({
                                message: "User Image is Successfully updated",
                                data: User
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

//chnage password:
router.post('/changePassword', async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.newPassword, salt);
    var user = {
        "email": req.body.email,
        "password": req.body.password,
        "newPassword": req.body.newPassword
    }
    const password = req.body.password;
    const { error } = validateChangeLogin(user);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        });
    }
    User.findOne({ where: { email: req.body.email } })
        .then(function (User) {

            if (!User) {

                res.status(401).json({
                    message: "No such Email Exist"
                });

            }

            bcrypt.compare(password, User.password, function (err, ress) {
                //console.log(ress);
                if (!ress) {
                    res.status(404).json({
                        message: "Please enter correct current password."
                    });
                } else {

                    User.update({
                        "password": newpassword,

                    })
                        .then(function (User) {
                            res.status(200).send({
                                message: "Successfully updated",
                                //data: User
                            });

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






function createUserRole(userID, roleid) {

    return new Promise(function (resolve, reject) {
        UserRole.create({
            userID: userID,
            roleID: roleid,
        }).then(UserRole => {

            resolve(true);
            // you can now access the newly created task via the variable task
        }).catch(function (err) {
            reject(err.message);
        });

    }, function (err) {
        reject(err.message);
    });

}

router.get('/me', [auth], async (req, res) => {

    User.findOne({
        where: { id: req.user.ID, },
        include: [{ model: UserRole, as: "role", attributes: ["roleID"] }]
    })
        .then(function (User) {
            if (!User) {
                res.status(404).json({
                    message: "No Such Owner Exist",
                    data: []
                });
            }
            res.status(200).json({
                message: "User Details",
                data: User
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
    var user = {
        "email": req.body.email,
        "password": req.body.password,
    }
    const password = req.body.password;
    const { error } = validatelogin(user);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        });
    }
    User.findOne({ where: { email: req.body.email } })
        .then(function (User) {

            if (!User) {

                res.status(401).json({
                    message: "No such Email Exist"
                });

            }

            bcrypt.compare(password, User.password, function (err, ress) {
                if (!ress) {
                    res.status(401).json({
                        message: "Email and password does not match"
                    });
                } else {

                    const token = jwt.sign({ ID: User.id }, config.get('jwtPrivateKey'));
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



//complete profile
router.get('/completeProfile', async (req, res) => {
    let BookObject = [];
    //create user entry in roles table
    var checkRole = checkUserRole(req.query.ID, 1);
    checkRole.then(function (Response) {
        if (Response.status == 1) {

            var initializegetBooked = getBookedEquipment();
            initializegetBooked.then(function (bookedEquiopment) {

                if (bookedEquiopment.booked.length > 0) {
                    for (var i = 0; i < bookedEquiopment.booked.length; i++) {
                        BookObject.push(bookedEquiopment.booked[i]['equipmentId']);
                    }
                }
                User.findOne({
                    where: { id: req.query.ID, },
                    include: [{ model: Rating, as: "Ratings" }, { model: Equipment, as: "EquipmentListings", where: { active: 0, id: { [Op.notIn]: BookObject }, } }]
                })
                    .then(function (User) {
                        if (!User) {
                            res.status(404).json({
                                message: "No such Owner Found",
                                data: []
                            });
                        }
                        res.status(200).json({
                            message: "Owner Details",
                            data: User
                        });
                    }).catch(function (err) {
                        res.status(500).json({
                            message: "Some error occur",
                            error: err.message
                        });
                    });


            }, function (err) {
                console.log(err.message);
            });




        } else {
            res.status(401).json({
                message: "Not Authorized",
                data: []
            });
        }



    }, function (err) {

        res.status(403).json({
            message: "Problem occur",
            data: err.message
        });

    });
});


function checkUserRole(userID, roleID) {

    return new Promise(function (resolve, reject) {
        UserRole.findAndCountAll({
            where: {
                userID: userID,
                roleID: roleID,
            },
        }).then(UserRole => {
            let status;
            status = { "status": UserRole.count };
            resolve(status);



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
                var result = { "count": Booked.count, "booked": Booked.rows };
                resolve(result);
            });
    }, function (err) {
        reject(err.message);
    });

}

module.exports = router;
