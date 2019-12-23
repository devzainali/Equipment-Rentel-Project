var mysql = require('mysql');
const express = require('express');
var Sequelize = require('sequelize');
const Op = Sequelize.Op
const router = express.Router();
const PendingRequest = require('../../../../../src/models/requests/pendingRequests');
const AcceptRequest = require('../../../../../src/models/requests/acceptRequests');
const auth = require('../../../../../middleware/auth');
const checkOwner = require('../../../../../middleware/checkowner');
const Equipment = require('../../../../../src/models/owner/equipments/equipments');
const User = require('../../../../../src/models/user/user')

PendingRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });
PendingRequest.belongsTo(User, { foreignKey: 'renterId' });

router.get('/', [auth, checkOwner], async (req, res) => {

  var initializegetAccept = getAcceptsquipment(req.user.ID);
  initializegetAccept.then(function (IDs) {

    if (IDs.count > 0) {
      AcceptObject = [];
      for (var i = 0; i < IDs.ids.length; i++) {
        AcceptObject.push(IDs.ids[i]['equipmentId']);
      }
      PendingRequest.
        findAndCountAll(
          {
            where: {
              ownerId: req.user.ID,
              id: { [Op.notIn]: AcceptObject },
            },
            include: [{ model: Equipment }, { model: User, attributes: ["id", "firstName", "lastName", "companyName", "address", "image"] }],
            order: [
              ['id', 'DESC'],
            ],
            distinct: true
          })
        .then(function (PendingRequest) {

          res.status(200).json({
            message: "Pending Requests",
            data: PendingRequest,
          });

        }).catch(function (err) {
          res.status(500).json({
            message: "Some error occur",
            data: err.message
          });
        });


    } else {

      PendingRequest.
        findAndCountAll(
          {

            where: {
              ownerId: req.user.ID
            },
            include: [{ model: Equipment }, { model: User, attributes: ["id", "firstName", "lastName", "companyName", "address", "image"] }],
            order: [
              ['id', 'DESC'],
            ],
            distinct: true
          })
        .then(function (PendingRequest) {

          res.status(200).json({
            message: "Pending Requests",
            data: PendingRequest,
          });

        }).catch(function (err) {
          res.status(500).json({
            message: "Some error occur",
            data: err.message
          });
        });

    }


  }, function (err) {
    res.status(500).json({
      message: "Some error occur",
      data: err.message
    });
  })


});
router.delete('/', [auth, checkOwner], async (req, res) => {
  if (!req.query.ID) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: "Experience ID is required"
    })

  }

  PendingRequest.destroy({
    where: {
      id: req.query.ID,
      ownerId: req.user.ID,
    },
  }).then(function (rowDeleted) {
    if (rowDeleted === 1) {


      res.status(200).json({
        message: "PendingRequest is Successfully Deleted",
      });
    } else {
      res.status(404).json({
        message: "PendingRequest not found",
      });
    }


  }).catch(function (err) {
    res.status(500).json({
      message: "Some error occur",
      error: err.message
    });
  });
});




function getAcceptsquipment(ownerID) {
  return new Promise(function (resolve, reject) {
    AcceptRequest.findAndCountAll(
      {
        where: {
          ownerId: ownerID
        },
        attributes: ['equipmentId'],
      })
      .then(function (AcceptRequest) {
        var result = { "count": AcceptRequest.count, "ids": AcceptRequest.rows };
        resolve(result);
      }).catch(function (err) {
        reject(err.message);
      });
  }, function (err) {
    reject(err.message);
  });

}

function NotifyRenter(ownerID, renterID) {
  return new Promise(function (resolve, reject) {

    User.findOne({ where: { id: ownerID }, attributes: ['firstName', 'lastName'] })
      .then(function (User) {
        const fullname = User.firstName + ' ' + User.lastName;
        const notification = fullname + ' Reject and deleted your Enquire request';
        createNotification = Notification.create({
          // "ownerId":ownerID,
          "renterId": renterID,
          "Notification": notification,
        }).then(function (Notification) {
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






module.exports = router; 