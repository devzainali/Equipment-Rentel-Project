const express = require('express');
const router = express.Router();

const Equipment = require('../../../../../../src/models/owner/equipments/equipments');

const Booked = require('../../../../../../src/models/requests/bookedRequest');

const Transaction = require('../../../../../../src/models/transaction/transaction');

const Notification = require('../../../../../../src/models/notification/notification')

const User = require('../../../../../../src/models/user/user');

const PaypalsCreditionals = require('../../../../../../src/models/owner/payout/paypalCreditional/paypalCreditional')

Booked.belongsTo(Transaction, { as: 'Transactions', foreignKey: 'order_id', targetKey: 'order_id' });




router.post('/back', async (req, res) => {


    if (!req.body.bookingID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "bookingID is required"
        });
    }

    var getdeployment = getBookedRequest(req.body.bookingID);
    getdeployment.then(function (bookedData) {

        if (bookedData.status == 1) {

            var deleteBookeds = deleteBooked(req.body.bookingID);
            deleteBookeds.then(function (destroy) {
                if (destroy.status == 1) {

                    var EquipmentDetail = checkEquipment(bookedData.object.equipmentId);
                    EquipmentDetail.then(function (equipmentName) {
                        var ownerNotificationSend = "Equipment(" + equipmentName + ') is successfully returned and available for booking.';
                        var initializenotifyOwner = Notify(bookedData.object.ownerId, ownerNotificationSend);
                    }, function (err) {
                        console.log(err.message);
                    });

                    res.status(200).json({
                        message: "Equipment is successfully released"
                    });


                } else {
                    res.status(200).json({
                        message: "Equipment is not released"
                    });
                }



            }, function (err) {
                res.status(404).json({
                    message: err.message
                });
            });


        } else {
            res.status(404).json({
                message: "No Such Booking found"
            });

        }


    }, function (err) {
        res.status(404).json({
            message: err.message
        });

    });



});


function getBookedRequest(bookedID) {
    return new Promise(function (resolve, reject) {
        Booked.findOne({
            where: { id: bookedID, },
            include: [{ model: Transaction, as: "Transactions", }, { model: User, as: "owner", attributes: ["id", "firstName", "lastName", "image"], include: [{ model: PaypalsCreditionals, as: "paypals", attributes: ["email"] }] }]
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
                    }).catch(function (err) {
                        reject(err.message);
                    });

                }

            });
    }, function (err) {
        reject(err.message);
    });

}


function deleteBooked(bookID) {
    return new Promise(function (resolve, reject) {
        Booked.destroy({
            where: {
                id: bookID,
            },
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                status = { "status": 1 };
                resolve(status);

            } else {
                status = { "status": 2 };
                resolve(status);
            }

        }).catch(function (err) {
            reject(err.message);
        });

    }, function (err) {
        reject(err.message);
    });

}


function Notify(id, notification) {
    return new Promise(function (resolve, reject) {
        createNotification = Notification.create({
            "userID": id,
            "Notification": notification,
        }).then(function (Notification) {
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





module.exports = router; 