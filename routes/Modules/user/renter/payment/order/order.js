const express = require('express');
const router = express.Router();
const { validate } = require('../../../../../../src/validations/requests/captureOrder');
const AcceptRequest = require('../../../../../../src/models/requests/acceptRequests');
const Notification = require('../../../../../../src/models/notification/notification');
const User = require('../../../../../../src/models/user/user');
const Equipment = require('../../../../../../src/models/owner/equipments/equipments');
const Booked = require('../../../../../../src/models/requests/bookedRequest');
const Transaction = require('../../../../../../src/models/transaction/transaction');
const RenterExpense = require('../../../../../../src/models/renter/renterExpence/renterExpense');
const PendingRequest = require('../../../../../../src/models/requests/pendingRequests')
var paypal = require('paypal-rest-sdk');
const config = require('config');
var Pusher = require('pusher');
let settingPusher = config.get('Notification');

var channels_client = new Pusher(settingPusher);

let settingpaypal = config.get('paypal');

paypal.configure(settingpaypal);

router.post('/captureOrder', async (req, res) => {

    var capturerequest = {
        "acceptID": req.body.acceptID,
        "orderID": req.body.orderID,
    }


    const { error } = validate(capturerequest);
    if (error) {
        res.status(403).json({
            status: false,
            error: 'Validation Error Occur',
            message: error.details[0].message
        });
    } else {


        //get accept request all data
        var getAcceptRequests = getAcceptRequest(req.body.acceptID);
        getAcceptRequests.then(function (acceptData) {


            Transaction.findAndCountAll({
                where: {
                    order_id: req.body.orderID,
                    equipmentID: acceptData.rows[0].equipmentId
                }
            }).then(function (Transaction) {
                if (Transaction.count > 0) {

                    res.status(302).json({
                        message: "Already Payment for this orderID"
                    });


                } else {


                    //do transaction entry
                    var allOperations = performTransaction(acceptData.rows[0], req.body.orderID);
                    allOperations.then(function (data) {
                        var EquipmentDetail = checkEquipment(acceptData.rows[0].equipmentId);
                        EquipmentDetail.then(function (equipmentName) {
                            var renterNotificationsend = "Your Payment and booking is successfully Done for the equipment(" + equipmentName + ')';
                            var ownerNotificationSend = "Payment is received in admin account for your equipment(" + equipmentName + ')';
                            var initializenotifyRenter = Notify(acceptData.rows[0].renterId, renterNotificationsend);
                            var initializenotifyOwner = Notify(acceptData.rows[0].ownerId, ownerNotificationSend);


                        }, function (err) {
                            console.log(err);
                        });

                        res.status(200).json({
                            message: "Order is successfully updated and booking held for the equipment"
                        });

                    }, function (err) {
                        res.status(404).json({
                            message: err.message
                        });

                    });


                }


            });


        }, function (err) {

            res.status(404).json({
                message: "No such Accept Request Found Against this acceptID",
            });
        });

    }
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
                //console.log(User);
                //    var ownersfullname =  _.map(owner, 'firstName');
                //    var ownerslastName =  _.map(owner, 'lastName');
                const fullname = User.firstName + '' + User.lastName;
                // console.log(fullname);
                // var response = {username:fullname,owner:owner}
                resolve(fullname);
            });
    });
}
function Notify(id, notification) {
    return new Promise(function (resolve, reject) {
        createNotification = Notification.create({
            "userID": id,
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
    });

}


function getAcceptRequest(acceptID) {
    return new Promise(function (resolve, reject) {
        AcceptRequest.findAndCountAll({ where: { id: acceptID, } })
            .then(function (AcceptRequest) {
                if (AcceptRequest.count > 0) {
                    resolve(AcceptRequest);
                } else {
                    reject(AcceptRequest);
                }

            });
    }, function (err) {
        reject(err.message);
    });

}


function performTransaction(AcceptObject, orderId) {
    return new Promise(function (resolve, reject) {
        console.log(orderId);
        //capture order first and did transaction entry in database

        paypal.capture.get(orderId, function (error, order) {
            if (error) {
                console.log(error);
                // res.json({
                //     error: error
                // });
                // throw error;
            } else {

                console.log(order);


                sequelize.transaction(async t => {

                    Transaction.create({
                        "order_id": orderId,
                        "renterID": AcceptObject.renterId,
                        "ownerID": AcceptObject.ownerId,
                        "payment_status": order.state,
                        "actualAmount": order.amount.total,
                        "currency": order.amount.currency,
                        "transactionFee": order.transaction_fee.value,
                        "equipmentID": AcceptObject.equipmentId,
                        "refund_url": order.links[1].href,
                        "created_time": order.create_time,
                        "updated_time": order.update_time,

                    })
                        .then(function (Transaction) {

                            Booked.create({
                                "order_id": Transaction.order_id,
                                "equipmentId": Transaction.equipmentID,
                                "ownerId": Transaction.ownerID,
                                "renterId": Transaction.renterID,
                                "location": AcceptObject.location,
                                "startDate": AcceptObject.startDate,
                                "endDate": AcceptObject.endDate,
                                "totalweeks": AcceptObject.totalweeks,
                                "totalMonths": AcceptObject.totalMonths,
                                "totalDays": AcceptObject.totalDays,
                                "overAllDays": AcceptObject.overAllDays,
                                "total": AcceptObject.total,
                                "deployment_status": "0"

                            }).then(function (Booked) {

                                RenterExpense.create({
                                    "TransactionID": Transaction.id,
                                    "equipmentID": Transaction.equipmentID,
                                    "renterID": Transaction.renterID,

                                }).then(function (RenterExpense) {

                                    PendingRequest.destroy({
                                        where: {
                                            equipmentId: RenterExpense.equipmentID,
                                        }
                                    }).then(function (PendingRequest) {

                                        AcceptRequest.destroy({
                                            where: {
                                                equipmentId: RenterExpense.equipmentID,
                                            }
                                        }).then(function (AcceptRequest) {

                                            resolve(Booked)


                                        });


                                    });

                                    resolve(true);

                                });




                            });



                        });

                }, function (err) {
                    reject(err.message);
                });


            }
        });


    }).catch(err => {
        reject(err.message);

    });

}





module.exports = router; 