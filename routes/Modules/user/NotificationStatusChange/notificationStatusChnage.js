const Notification = require('../../../../src/models/notification/notification');

const express = require('express');
const router = express.Router();

router.put('/Change', async (req, res) => {

  if (!req.query.ID) {
    res.json({
      status: 403,
      message: "Validation Error",
      error: "ID is required"
    });
  }


  //inserting data in db
  Notification.findOne({ where: { id: req.query.ID, } })
    .then(function (Notification) {

      if (!Notification) {
        res.json({
          status: 404,
          message: "No such Notification associated with this ID",
          data: []
        });
      }
      // Check if record exists in db
      if (Notification) {
        //check for images comes or not
        Notification.update({
          "isRead": 1,
        })
          .then(function (Notification) {

            res.json({
              status: 200,
              message: "Notification is Successfully updated",
              data: Notification
            });

          })
      }
    }).catch(function (err) {
      res.json({
        status: 200,
        message: "No such Notification Exist to update",
        error: err.message
      });
    });

});



module.exports = router;


