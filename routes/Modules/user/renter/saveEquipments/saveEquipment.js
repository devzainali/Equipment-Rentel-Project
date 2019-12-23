const express = require('express');
const router = express.Router();

const Save = require('../../../../../src/models/renter/saved/saveEquipment');
const auth = require('../../../../../middleware/auth');
const checkrenter = require('../../../../../middleware/checkrenter');
const { validate } = require('../../../../../src/validations/saveEquipment/saveEquipment');

router.post('/', [auth, checkrenter], async (req, res) => {

  var save = {
    "equipmentId": req.body.equipmentId,
  }

  const { error } = validate(save);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {


    Save.findOrCreate({
      where: {
        equipmentId: req.body.equipmentId,
        userID: req.user.ID,
      },
      defaults: { // set the default properties if it doesn't exist
        "equipmentId": req.body.equipmentId,
        "userID": req.user.ID,
      }
    }).then(function (result) {
      var AcceptObject = result[0], // the instance of the author
        created = result[1]; // boolean stating if it was created or not

      if (!created) { // false if author already exists and was not created.
        res.status(302).json({
          message: "You already save this Equipment",
          data: AcceptObject
        });
      }

      res.status(200).json({
        message: "Equipment is Successfully saved",
        data: AcceptObject
      });

    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });

  }

});

//deleting record
router.delete('/delete', [auth, checkrenter], async (req, res) => {

  var save = {
    "equipmentId": req.body.equipmentId,
  }

  const { error } = validate(save);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {


    Save.destroy({
      where: {
        equipmentId: req.body.equipmentId,
        userID: req.user.ID,
      }
    }).then(function (Save) {
      if (Save === 1) {

        res.status(200).json({
          message: "Deleted Successfully",
          data: true
        });
      } else {
        res.status(404).json({
          message: "No Such Equipment Exist to delete",
          data: false
        });

      }

    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });

  }

});


router.get('/get', [auth, checkrenter], async (req, res) => {

  Save.findAndCountAll({
    where: { userID: req.user.ID, },
    order: [
      ['id', 'DESC'],
    ],
  })
    .then(function (Save) {

      if (!Save) {
        res.status(404).json({
          message: "No Save Jobs Found",
          data: []
        });
      }

      res.status(200).json({
        message: "Saved Jobs",
        data: Save
      });

    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });

});


module.exports = router;