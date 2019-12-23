const auth = require('../../../../middleware/auth');
const admin = require('../../../../middleware/admin');
const { validate } = require('../../../../src/validations/admin/pages/pages');
const Page = require('../../../../src/models/admin/pages/page');

const express = require('express');
const router = express.Router();


//updating 
router.get('/detail', [auth, admin], async (req, res) => {

  if (!req.query.ID) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: "Page ID is required"
    })
  }

  //inserting data in db
  Page.findOne({ where: { id: req.query.ID, } })
    .then(function (Page) {

      if (!Page) {
        res.status(404).json({
          message: "No such Page Found",
          data: []
        });
      }
      if (Page) {
        res.status(200).json({
          message: "Page detail",
          data: Page
        });
      }
    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        data: err.message
      });
    });

});



//updating 
router.put('/Update', [auth, admin], async (req, res) => {


  var page = {
    "ID": req.body.ID,
    "pageTitle": req.body.pageTitle,
    "content": req.body.content,
  }

  const { error } = validate(page);
  if (error) {

    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {

    //inserting data in db
    Page.findOne({ where: { id: req.body.ID, } })
      .then(function (Page) {

        if (!Page) {
          res.status(404).json({
            message: "No such Page Found",
            data: []
          });
        }
        if (Page) {
          Page.update({
            "pageTitle": req.body.pageTitle,
            "content": req.body.content,
          })
            .then(function (Page) {
              res.status(200).send({
                message: "Successfully updated",
                data: Page
              });

            })
        }
      }).catch(function (err) {
        res.status(500).json({
          message: "Some error occur",
          data: err.message
        });
      });

  }

});



module.exports = router;