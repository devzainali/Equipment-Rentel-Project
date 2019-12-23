const auth = require('../../../../middleware/auth');

const Notification = require('../../../../src/models/notification/notification');

const express = require('express');
const router = express.Router();

router.get('/get', [auth], async (req, res) => {

  Notification.findAndCountAll({
    where: {
      userID: req.user.ID
    },
    order: [
      ['id', 'DESC'],
    ],
  })
    .then(function (Notification) {

      res.json({
        status: 200,
        message: "All Notifications",
        data: Notification
      });

    }).catch(function (err) {
      res.json({
        status: 500,
        message: "Error",
        error: err.message
      });
    });

});


router.put('/updateAll', [auth], async (req, res) => {

  Notification.update(
    { isRead: 1 },
    { where: { userID: req.user.ID } }
  )
    .then(function (status) {

      res.json({
        status: 200,
        message: "Notification marks as read",
        //data: status
      });

    }).catch(function (err) {
      res.json({
        status: 500,
        message: "Error",
        error: err.message
      });
    });

});

module.exports = router;


