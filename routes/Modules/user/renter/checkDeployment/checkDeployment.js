const express = require('express');
const router = express.Router();
const AcceptRequest = require('../../../../../src/models/requests/acceptRequests');
const Notification = require('../../../../../src/models/notification/notification');
const User = require('../../../../../src/models/user/user');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');
const Booked = require('../../../../../src/models/requests/bookedRequest');
const Transaction = require('../../../../../src/models/transaction/transaction');
const RenterExpense = require('../../../../../src/models/renter/renterExpence/renterExpense');
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');
const PaypalsCreditionals = require('../../../../../src/models/owner/payout/paypalCreditional/paypalCreditional');
const Payouts = require('../../../../../src/models/owner/payout/payout');

var paypal = require('paypal-rest-sdk');
const config = require('config');

var Pusher = require('pusher');
let settingPusher = config.get('Notification');
var channels_client = new Pusher(settingPusher);


let settingpaypal = config.get('paypal');

paypal.configure(settingpaypal);

Booked.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasOne(PaypalsCreditionals, { as: 'paypals', foreignKey: 'owner_id' });
Booked.belongsTo(Transaction, { as: 'Transaction', foreignKey: 'order_id', targetKey: 'order_id' });

router.post('/check', async (req, res) => {

    if (!req.body.bookingID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "bookingID is required"
        });
    }

    //get accept request all data
    var getdeployment = getBookedRequest(req.body.bookingID);
    getdeployment.then(function (bookedData) {

        if (bookedData.status == 1) {

            //do payout
            var allOperations = performPayout(bookedData.object);
            allOperations.then(function (data) {

                var payoutDetail = getPayoutDetail(data, bookedData.object);
                payoutDetail.then(function (result) {

                    var EquipmentDetail = checkEquipment(bookedData.object.equipmentId);
                    EquipmentDetail.then(function (equipmentName) {
                        var renterNotificationsend = "Your Payment for the Equipment(" + equipmentName + ')' + " is successfully send to Owner Account.";
                        var ownerNotificationSend = "Received Payment for your equipment(" + equipmentName + ') is successfully send to your Account.';
                        var initializenotifyRenter = Notify(bookedData.object.renterId, renterNotificationsend);
                        var initializenotifyOwner = Notify(bookedData.object.ownerId, ownerNotificationSend);


                    }, function (err) {
                        console.log(err.message);
                    });

                    res.status(200).json({
                        message: "Successfully payout",
                        data: result
                    });

                }, function (err) {
                    res.status(404).json({
                        message: err.message
                    });

                });


            }, function (err) {
                res.status(404).json({
                    message: err.message
                });

            });

        } else {
            res.status(404).json({
                message: "No such Booking Request Found Against this bookingID",
            });

        }



    }, function (err) {

        res.status(404).json({
            message: err.message,
        });
    });




});


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



function getBookedRequest(bookedID) {
    return new Promise(function (resolve, reject) {
        Booked.findOne({
            where: { id: bookedID, },
            include: [{ model: Transaction, as: "Transaction", }, { model: User, as: "owner", attributes: ["id", "firstName", "lastName", "image"], include: [{ model: PaypalsCreditionals, as: "paypals", attributes: ["email"] }] }]
        })
            .then(function (Booked) {
                let status;
                if (!Booked) {
                    console.log('not found')
                    status = { "status": 2, "object": Booked };
                    resolve(status);
                }
                if (Booked) {

                    Booked.update({
                        "deployment_status": 1,
                    }).then(function (Booked) {
                        status = { "status": 1, "object": Booked };
                        resolve(status);
                    });

                }

            });
    }, function (err) {
        reject(err.message);
    });

}

function getPayoutDetail(payputObject, bookedObject) {
    return new Promise(function (resolve, reject) {

        //resolve(bookedObject);
        //console.log(payputObject);
        //console.log(bookedObject);
        //var payoutId = "FM36ETVA62HTS";
        var payoutId = payputObject.batch_header.payout_batch_id;
        setTimeout(() => {
            console.log('4 seconds Timer expired!!!');
            paypal.payout.get(payoutId, function (error, payoutData) {
                if (error) {
                    //console.log(error.response);
                    reject(error.response);
                    // throw error;
                } else {
                    // resolve(payoutData);
                    console.log("Get Payout Response");
                    //console.log(bookedObject);
                    //resolve(bookedObject);
                    // console.log(payoutData.items[0]);
                    //doinf entry in payout


                    Payouts.create({
                        "transactionID": bookedObject.Transaction.id,
                        "payoutID": payoutData.batch_header.payout_batch_id,
                        "payout_itemID": payoutData.items[0].payout_item_id,
                        "payout_transactionID": payoutData.items[0].transaction_id,
                        "status": payoutData.batch_header.batch_status,
                        "receiver_email": payoutData.items[0].payout_item.receiver,
                        "Amount": payoutData.items[0].payout_item.amount.value,
                        "transactionFee": payoutData.items[0].payout_item_fee.value,
                        "equipmentID": bookedObject.equipmentId,
                        "created_time": payoutData.batch_header.time_created,
                        "updated_time": payoutData.batch_header.time_completed,
                    }).then(function (Payouts) {

                        resolve(Payouts);

                    });

                }
            });

        }, 6000)
    });

}


function performPayout(bookedObject) {
    return new Promise(function (resolve, reject) {

        //capture order first and did transaction entry in database

        var sender_batch_id = Math.random().toString(36).substring(9);

        var payoutAmount = Math.round(bookedObject.Transaction.actualAmount - bookedObject.Transaction.transactionFee);
        //console.log(payoutAmount);
        var create_payout_json = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id,
                "email_subject": "You have a payment"
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": payoutAmount,
                        "currency": "USD"
                    },
                    "receiver": bookedObject.owner.paypals.email,
                    "note": "Thank you New payout for your Equipment ID " + bookedObject.equipmentId,
                }
            ]
        };

        var sync_mode = 'false';

        paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
            if (error) {
                console.log(error.response);
                reject(error.response);

            } else {
                console.log("Create Single Payout Response");
                //console.log(payout);
                resolve(payout);

            }
        });


    }).catch(err => {
        reject(err.message);

    });

}





module.exports = router; 