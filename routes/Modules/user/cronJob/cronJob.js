const cron = require('node-cron');
const Accept = require('../../../../src/models/requests/acceptRequests');
const User = require('../../../../src/models/user/user');
const Notification = require('../../../../src/models/notification/notification');
const Equipment = require('../../../../src/models/owner/equipments/equipments');

var Pusher = require('pusher');
const config = require('config');

let settingPusher = config.get('Notification');

var channels_client = new Pusher(settingPusher);

var task = cron.schedule('* * 1 * *', () => {

    let GlobalAcceptData;
    var AcceptRequests = getAcceptRequest();
    let ID;
    AcceptRequests.then(function (resultobject) {
        if (resultobject.count > 0) {
            console.log('accept requests found');

            for (i = 0; i < resultobject.rows.length; i++) {
                var timeInMs = Date.now();
                if (diff_hours(timeInMs, resultobject.rows[i].createdAt) >= 24) {
                    GlobalAcceptData = resultobject.rows[i];
                    var deleteAcceptRequest = deleteAcceptRequests(resultobject.rows[i].id, resultobject.rows[i].equipmentId, resultobject.rows[i].renterId, resultobject.rows[i].ownerId);
                    deleteAcceptRequest.then(function (deletePanel) {
                        if (deletePanel) {
                            console.log("deleted");
                        }

                    }, function (err) {
                        console.log(err.message);
                    });

                }
            }

        } else {
            console.log('No Accept request found');
        }


    }, function (err) {
        console.log(err);
    });

    //console.log('Printing this line every minute in the terminal');
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

function getAcceptRequest() {
    return new Promise(function (resolve, reject) {
        Accept.findAndCountAll()
            .then(function (Accept) {
                resolve(Accept);

            });
    }, function (err) {
        reject(err.message);
    });

}


function deleteAcceptRequests(id, eqID, renterID, ownerID) {
    return new Promise(function (resolve, reject) {

        Accept.destroy({
            where: {
                id: id,
            },
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                var EquipmentDetail = checkEquipment(eqID);
                EquipmentDetail.then(function (equipmentName) {
                    // var deleteAcceptRequest = deleteAcceptRequest(resultobject.rows[0].id);
                    var renterNotificationsend = "Your Accept Request is cancelled because you did not complete process Payment  for the equipment(" + equipmentName + ') in 24 Hours Time period.';
                    var ownerNotificationSend = "Accept request is deleted for your equipment(" + equipmentName + ') because the renter person cannot complete payment process in 24 Hours Time period.';
                    var initializenotifyRenter = Notify(renterID, renterNotificationsend);
                    var initializenotifyOwner = Notify(ownerID, ownerNotificationSend);
                    resolve(true);
                }, function (err) {
                    reject(err.message);
                });

            } else {
                resolve(false);
            }


        }).catch(function (err) {
            reject(err.message);
        });

    }, function (err) {
        reject(err.message);

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
function diff_hours(dt2, dt1) {

    var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}