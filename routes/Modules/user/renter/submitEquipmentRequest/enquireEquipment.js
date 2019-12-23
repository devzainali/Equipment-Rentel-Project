const auth = require('../../../../../middleware/auth');
const checkRenter = require('../../../../../middleware/checkrenter');
const express = require('express');
const router = express.Router();
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');
const { validate } = require('../../../../../src/validations/requests/pendingRequest');
const User = require('../../../../../src/models/user/user');
const Notification = require('../../../../../src/models/notification/notification');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');

const config = require('config');
var Pusher = require('pusher');
let settingPusher = config.get('Notification');

var channels_client = new Pusher(settingPusher);


router.post('/', [auth, checkRenter], async (req, res) => {
  let renterName;
  const renterID = req.body.renterId;
  var Pendingrequest = {
    "equipmentId": req.body.equipmentId,
    "ownerId": req.body.ownerId,
    "renterId": req.user.ID,
    "location": req.body.location,
    "startDate": req.body.startDate,
    "endDate": req.body.endDate,
    "totalweeks": req.body.totalweeks,
    "totalMonths": req.body.totalMonths,
    "totalDays": req.body.totalDays,
    "overAllDays": req.body.overAllDays,
    "total": req.body.total,
    "comments": req.body.comments,
  }

  const { error } = validate(Pendingrequest);
  if (error) {
    res.json({
      status: false,
      error: 'Validation Error Occur',
      message: error.details[0].message
    });
  } else {
    PendingRequest.findOrCreate({
      where: {
        equipmentId: req.body.equipmentId,
        renterId: req.user.ID,
      },
      defaults: { // set the default properties if it doesn't exist
        "equipmentId": req.body.equipmentId,
        "ownerId": req.body.ownerId,
        "renterId": req.user.ID,
        "location": req.body.location,
        "startDate": req.body.startDate,
        "endDate": req.body.endDate,
        "totalweeks": req.body.totalweeks,
        "totalMonths": req.body.totalMonths,
        "totalDays": req.body.totalDays,
        "overAllDays": req.body.overAllDays,
        "total": req.body.total,
        "comments": req.body.comments,
      }
    }).then(function (result) {

      var PendingObject = result[0], // the instance of the author
        created = result[1]; // boolean stating if it was created or not

      if (!created) { // false if author already exists and was not created.
        res.json({
          status: 200,
          message: "You are already applied for this equipment.",
          data: PendingObject
        });
      } else {
        var NotificationSend = NotifyOwner(req.body.ownerId, req.user.ID);
        res.json({
          status: 200,
          message: "Request has been submitted.Wait for owner response.",
          data: PendingObject
        });

      }



    });

  }


});

function NotifyOwner(ownerID, renterID) {
  return new Promise(function (resolve, reject) {
    console.log(ownerID);
    User.findOne({ where: { id: renterID }, attributes: ['firstName', 'lastName'] })
      .then(function (User) {
        const fullname = User.firstName + '' + User.lastName;
        const notification = fullname + ' enquire your eqipment please check Pending Request to check Enquire Request.';
        createNotification = Notification.create({
          "userID": ownerID,
          "Notification": notification,
        }).then(function (Notification) {

          //triggering notification to company (companyNotification-development)
          var conversation = 'my-event';
          channels_client.trigger('moquireNotification', conversation, Notification);
          //triggering notification for job Seekers 
          resolve(true);
        }).catch(function (err) {
          reject(err.message);
        });
      }).catch(function (err) {
        reject(err.message);
      });
  }, function (err) {
    reject(err.message);
  });


}


//   function getOwner(equipmentID){
//     return new Promise(function(resolve,reject){
//         console.log(ownerID);
//         Equipment.findOne({ where: { id: equipmentID }, attributes: ['ownerId'] })
//         .then(function (User) {
//             const fullname = User.firstName+''+User.lastName;
//             const notification = fullname+' enquire your eqipment please check Pending Request to check Enquire Request.';
//             createNotification =  Notification.create({
//                 "userID":ownerID,
//                 "Notification":notification,
//             }).then(function(Notification){

//           //triggering notification to company (companyNotification-development)
//           var conversation = 'my-event';
//           channels_client.trigger('moquireNotification', conversation, Notification);
//           //triggering notification for job Seekers 
//                resolve(true);
//             }).catch(function (err) {
//                 reject(err.message); 
//             });
//         }).catch(function (err) {
//             reject(err.message); 
//         });
//     },function (err) {
//             reject(err.message);
//         });


// }






module.exports = router; 
