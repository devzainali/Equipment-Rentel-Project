const auth = require('../../../../../../middleware/auth');
const ownerauth = require('../../../../../../middleware/checkowner');
const { validate } = require('../../../../../../src/validations/owner/paypalCreditional/paypalCreditional');

const express = require('express');
const router = express.Router();

const paypal = require('../../../../../../src/models/owner/payout/paypalCreditional/paypalCreditional');
//Category.belongsTo(Category,{foreignKey: 'id'});
router.get('/', [auth, ownerauth], async (req, res) => {


  paypal.findOne({
    where: {
      owner_id: req.user.ID,
    }
  }).then(paypal => {
    res.status(200).json({
      message: "creditionals",
      data: paypal
    });
  }).catch(function (err) {
    res.status(500).json({
      message: "Some error occur",
      data: err.message
    });
  });



});

// add paypalCreditionalss
router.post('/', [auth, ownerauth], async (req, res) => {

  //console.log(req.user.ID);
  let output
  var paypalCreditionalss = {
    "owner_id": req.user.ID,
    "email": req.body.email,
  }

  const { error } = validate(paypalCreditionalss);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {

    //become employee of the company
    var initializecheck = checkRecord(req.user.ID, req.body.email);//AccountType,companyID,jobSeekerId,status
    initializecheck.then(function (Response) {
      console.log(Response);
      if (Response.status == 1) {
        //console.log('successfully become employee of company')
        res.json({
          status: 200,
          message: "Paypal creditionals updated successfully",
          data: Response.object
        });
      }

      res.json({
        status: 200,
        message: "Paypal creditionals created successfully",
        data: Response.object
      });


    }, function (err) {

      res.json({
        status: 500,
        message: "Some error occur",
        error: err.message
      });
    })


    //become employee of the company
  }




});





function checkRecord(owner_id, email) {
  return new Promise(function (resolve, reject) {

    var initializegetFollowers = getcheck(owner_id, email);
    initializegetFollowers.then(function (SeekerResponse) {
      if (SeekerResponse.status == true) {
        console.log('record found');

        var initializeupdaterecord = updateRecord(owner_id, email);
        initializeupdaterecord.then(function (ResponseGiven) {
          let updated;
          updated = { "status": 1, object: ResponseGiven };
          resolve(updated);


        }, function (err) {
          reject(err.message);
        })

      } else {
        var initializeupdaterecord = createRecord(owner_id, email);
        initializeupdaterecord.then(function (ResponseGiven) {
          let updated;
          updated = { "status": 2, object: ResponseGiven };
          resolve(updated);
        }, function (err) {
          reject(err.message);
        })

      }


    }, function (err) {
      reject(err.message);
    })

  });

}



function getcheck(ownerID, emailaddress) {
  return new Promise(function (resolve, reject) {
    paypal.findOne(
      {
        where: { owner_id: ownerID },
      })
      .then(function (paypal) {
        let result;
        if (paypal) {
          result = { "status": true };
        } else {
          result = { "status": false };
        }

        resolve(result);
      });
  }, function (err) {
    reject(err.message);
  });

}

function createRecord(ownerID, emailaddress) {
  return new Promise(function (resolve, reject) {
    var creditionals = {
      "owner_id": ownerID,
      "email": emailaddress,
    }
    paypal.create(creditionals)
      .then(function (paypal) {
        resolve(paypal);
      });
  }, function (err) {
    reject(err.message);
  });

}

function updateRecord(ownerID, emailaddress) {
  return new Promise(function (resolve, reject) {

    //updating record
    paypal.findOne({ where: { owner_id: ownerID } })
      .then(function (paypal) {

        // Check if record exists in db
        if (paypal) {
          paypal.update({
            "owner_id": ownerID,
            "email": emailaddress,
          })
            .then(function (paypal) {
              resolve(paypal);

            })
        }
      }).catch(function (err) {
        res.json({
          status: 200,
          message: err.message,
        });
      });


    //updating record ends here
  }, function (err) {
    reject(err.message);
  });

}



module.exports = router; 