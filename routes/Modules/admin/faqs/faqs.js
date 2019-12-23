const auth = require('../../../../middleware/auth');
const admin = require('../../../../middleware/admin');
const { validate, validateUpdate, validateDelete } = require('../../../../src/validations/admin/faqs/faqs');
const Faq = require('../../../../src/models/admin/faqs/faqs');

const express = require('express');
const router = express.Router();



router.get('/all', async (req, res) => {
  Faq.
    findAndCountAll()
    .then(function (Faq) {
      res.status(200).json({
        message: "Faqs",
        data: Faq,
      });

    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        data: err.message
      });
    });
});

//Register User
router.post('/add', [auth, admin], async (req, res) => {

  var faq = {
    "question": req.body.question,
    "answer": req.body.answer,
  }

  const { error } = validate(faq);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {
    //inserting data in db
    Faq.findOrCreate({
      where: {
        question: req.body.question,
      },
      defaults: { // set the default properties if it doesn't exist
        "question": req.body.question,
        "answer": req.body.answer,
      }
    }).then(function (result) {
      var AcceptObject = result[0], // the instance of the User
        created = result[1]; // boolean stating if it was created or not

      if (!created) { // false if user already exists and was not created.
        res.status(302).json({
          message: "Question is already exist",
          data: AcceptObject
        });
      }

      res.status(200).json({
        message: "Question added successfully",
        data: AcceptObject
      });




    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        data: err.message
      });
    });

  }

});


//updating owner
router.put('/Update', [auth, admin], async (req, res) => {

  //check for id is comming in req or not


  var faq = {
    "ID": req.body.ID,
    "question": req.body.question,
    "answer": req.body.answer,
  }

  const { error } = validateUpdate(faq);
  if (error) {

    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {

    //inserting data in db
    Faq.findOne({ where: { id: req.body.ID, } })
      .then(function (Faq) {

        if (!Faq) {
          res.status(404).json({
            message: "No such Faq Found",
            data: []
          });
        }
        if (Faq) {
          Faq.update({
            "question": req.body.question,
            "answer": req.body.answer,
          })
            .then(function (Faq) {
              res.status(200).send({
                message: "Successfully updated",
                data: Faq
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

//deleting record
router.delete('/delete', [auth, admin], async (req, res) => {

  var faq = {
    "ID": req.body.ID,
  }

  const { error } = validateDelete(faq);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {


    Faq.destroy({
      where: {
        id: req.body.ID,
      }
    }).then(function (Faq) {
      if (Faq === 1) {

        res.status(200).json({
          message: "Deleted Successfully",
          data: true
        });
      } else {
        res.status(404).json({
          message: "No Such Faq Exist to delete",
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



module.exports = router;