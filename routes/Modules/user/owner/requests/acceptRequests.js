const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const AcceptRequest = require('../../../../../src/models/requests/acceptRequests');
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');

const Notification = require('../../../../../src/models/notification/notification');
const auth = require('../../../../../middleware/auth');
const checkOwnerAuth = require('../../../../../middleware/checkowner');

const User = require('../../../../../src/models/user/user');

const Equipment = require('../../../../../src/models/owner/equipments/equipments');

const Paypal = require('../../../../../src/models/owner/payout/paypalCreditional/paypalCreditional');


AcceptRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });
AcceptRequest.belongsTo(User, { foreignKey: 'renterId' });

var Pusher = require('pusher');
const config = require('config');

let settingPusher = config.get('Notification');

var channels_client = new Pusher(settingPusher);

router.get('/', [auth, checkOwnerAuth], async (req, res) => {

    AcceptRequest.findAndCountAll({
        where: {
            ownerId: req.user.ID
        },
        include: [{ model: User }, { model: Equipment }],
        //attributes: ["id","ownerStar","review"],
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




router.post('/', [auth, checkOwnerAuth], async (req, res) => {

    var setPaypalCheck = getPaypalEmail(req.user.ID);
    setPaypalCheck.then(function (resultComes) {
        if (resultComes.count == 0) {
            res.status(403).json({
                error: 'Validation Error Occur',
                message: "Please specify your paypal email first then you able to accept any offer"
            });
        } else {
            if (resultComes.rows[0].email == '') {
                res.status(403).json({
                    error: 'Validation Error Occur',
                    message: "Please specify your paypal email correctly first then you able to accept any offer"
                });
            } else {

                if (!req.body.pendingRequestID) {
                    res.status(403).json({
                        error: 'Validation Error Occur',
                        message: "pendingRequestID is required"
                    });
                }

                var getPendingData = getPendingRequest(req.body.pendingRequestID);
                getPendingData.then(function (dataComes) {

                    if (dataComes.count == 1) {
                        console.log('fdffd');
                        AcceptRequest.findOrCreate({
                            where: {
                                equipmentId: dataComes.rows[0].equipmentId.trim(),
                                //renterId: req.body.renterId.trim(),
                            },
                            defaults: { // set the default properties if it doesn't exist
                                "equipmentId": dataComes.rows[0].equipmentId,
                                "ownerId": dataComes.rows[0].ownerId,
                                "renterId": dataComes.rows[0].renterId,
                                "location": dataComes.rows[0].location,
                                "startDate": dataComes.rows[0].startDate,
                                "endDate": dataComes.rows[0].endDate,
                                "totalweeks": dataComes.rows[0].totalweeks,
                                "totalMonths": dataComes.rows[0].totalMonths,
                                "totalDays": dataComes.rows[0].totalDays,
                                "overAllDays": dataComes.rows[0].overAllDays,
                                "total": dataComes.rows[0].total,
                                "comments": dataComes.rows[0].comments,
                            }
                        }).then(function (result) {
                            var AcceptObject = result[0], // the instance of the author
                                created = result[1]; // boolean stating if it was created or not

                            if (!created) { // false if author already exists and was not created.
                                res.status(200).json({
                                    message: "You are already Accept request for this equipment.wait for renter to complete payment process.",
                                    data: AcceptObject
                                });
                            } else {

                                var deletePending = deletePendings(req.body.pendingRequestID, req.user.ID.toString());
                                //check renter detail
                                var initializecheckOwner = checkOwner(req.user.ID);
                                initializecheckOwner.then(function (ownerResponse) {


                                    const notification = ownerResponse + ' Accept you request Please check your Accepted Request Listing to complete payment process.Accepted Request is valid for only 24 Hours.';
                                    var initializenotifyRenter = NotifyRenter(dataComes.rows[0].renterId, notification);
                                    initializenotifyRenter.then(function (result2) {
                                        if (result2) {
                                            res.status(200).json({
                                                message: "Request accepted successfully.Notification has been sent to renter to complete payment process.",
                                                data: AcceptObject
                                            });
                                        }

                                    }, function (err) {
                                        res.status(500).json({
                                            error: 'Fatel error',
                                            message: err.message
                                        });
                                    })

                                }, function (err) {
                                    res.status(500).json({
                                        message: "Request accepted successfully.Notification has been sent to renter to complete payment process.",
                                        data: AcceptObject
                                    });
                                })

                            }



                        });

                    } else {
                        res.status(404).json({
                            message: 'No such Pending Request',
                        });
                    }



                }, function (err) {
                    console.log(err.message);
                });

            }



        }


    }, function (err) {
        console.log(err.message);
    });









});

//check if renter already make a request for this equipment or not
function checkRenter(RenterId) {
    return new Promise(function (resolve, reject) {
        User.findOne({ where: { id: RenterId }, attributes: ['firstName', 'lastName'] })
            .then(function (User) {
                const fullname = User.firstName + '' + User.lastName;
                var response = { username: fullname, renter: User }
                resolve(response);
            });
    });

}
//check if renter already make a request for this equipment or not
function checkOwner(OwnerId) {
    return new Promise(function (resolve, reject) {
        User.findOne({ where: { id: OwnerId }, attributes: ['firstName', 'lastName'] })
            .then(function (User) {
                console.log(User);
                //    var ownersfullname =  _.map(owner, 'firstName');
                //    var ownerslastName =  _.map(owner, 'lastName');
                const fullname = User.firstName + '' + User.lastName;
                // console.log(fullname);
                // var response = {username:fullname,owner:owner}
                resolve(fullname);
            });
    });

}
function NotifyRenter(RenterId, notification) {
    return new Promise(function (resolve, reject) {
        createNotification = Notification.create({
            "userID": RenterId,
            "Notification": notification,
        }).then(function (Notification) {
            //triggering notification to company (companyNotification-development)
            var conversation = 'my-event';
            channels_client.trigger('moquireNotification', conversation, Notification);
            //triggering notification for job Seekers
            resolve(true);
        })
    });

}
function checkEquipment(equipment) {
    return new Promise(function (resolve, reject) {
        Equipment.findOne({ where: { id: equipment }, attributes: ['title'] })
            .then(function (Equipment) {
                const fullname = Equipment.title;
                //var response = {count:Renter.length,username:fullname,renter:Renter}
                resolve(fullname);
            });
    }, function (err) {
        reject(false);
    });

}



function deletePendings(PendingRequestID, ownerID) {
    return new Promise(function (resolve, reject) {
        PendingRequest.destroy({
            where: {
                id: PendingRequestID,
                ownerId: ownerID,
            },
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                resolve(true);

            } else {

                resolve("not Found");
            }


        }).catch(function (err) {
            reject(err.message);
        });

    }, function (err) {
        reject(err.message);
    });
}


function getPendingRequest(pendingID) {
    return new Promise(function (resolve, reject) {
        PendingRequest.findAndCountAll({ where: { id: pendingID, } })
            .then(function (PendingRequest) {
                resolve(PendingRequest);

            });
    }, function (err) {
        reject(err.message);
    });

}



function getPaypalEmail(ownerID) {
    return new Promise(function (resolve, reject) {
        Paypal.findAndCountAll({ where: { owner_id: ownerID, } })
            .then(function (Paypal) {
                resolve(Paypal);

            });
    }, function (err) {
        reject(err.message);
    });

}


module.exports = router; 