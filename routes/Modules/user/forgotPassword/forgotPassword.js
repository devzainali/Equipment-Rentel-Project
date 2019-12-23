const express = require('express');
const router = express.Router();

const User = require('../../../../src/models/user/user');

const { validate, validateUpdate, validateUpdateReset } = require('../../../../src/validations/user/forgotPassword/forgotPassword');

nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  //res.writeHead(200);
  var forgot = {
    "email": req.body.email,
  }
  const { error } = validate(forgot);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then(function (User) {

      if (!User) {
        res.status(404).json({
          message: "No such Email exist",
          data: []
        });
      }

      //updating hash 

      var initializeUpdateView = update(req.body.email);
      initializeUpdateView.then(function (Response) {

        res.status(200).json({
          message: "Reset password Email is send successfully please check email address",
          data: true
        });

      }, function (err) {
        res.status(500).json({
          message: "Some error occur",
          error: err.message
        });
      })
      //updating hash 



    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });



  }

});

//check hash exist or not
router.post('/check', async (req, res) => {
  //res.writeHead(200);
  var forgot = {
    "hash": req.body.hash,
  }
  const { error } = validateUpdate(forgot);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {
    User.findOne({
      where: {
        hash: req.body.hash,
      },
    }).then(function (User) {

      if (!User) {
        res.status(404).json({
          message: "No such Email exist again this token",
          data: false
        });
      }

      res.status(200).json({
        message: "Email exist",
        data: User
      });




    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });



  }

});

router.post('/updatePasword', async (req, res) => {
  //res.writeHead(200);
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  var reset = {
    "password": req.body.password,
    "hash": req.body.hash,
    "email": req.body.email,
  }
  const { error } = validateUpdateReset(reset);
  if (error) {
    res.status(403).json({
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {
    User.findOne({
      where: {
        email: req.body.email,
        hash: req.body.hash,
      },
    }).then(function (User) {
      if (!User) {
        res.status(403).json({
          message: "Token is Invalid",
          data: false
        });
      }

      if (User) {
        //check for images comes or not
        User.update({
          "password": password,
          "hash": null,
        })
          .then(function (User) {
            res.status(200).json({
              message: "Password Reset Successfully",
              data: User
            });

          })
      }




    }).catch(function (err) {
      res.status(500).json({
        message: "Some error occur",
        error: err.message
      });
    });



  }

});

function update(email) {
  return new Promise(function (resolve, reject) {

    //inserting data in db
    User.findOne({ where: { email: email, } })
      .then(function (User) {

        // Check if record exists in db
        if (User) {
          var randomValue = randomString(15);
          console.log(randomValue);
          //check for images comes or not
          User.update({
            "hash": randomValue,
          })
            .then(function (User) {
              var emailStatus = sendEmail(email, randomValue);
              if (emailStatus) {
                resolve(true);
              }
              reject(false);

            })
        }
      }).catch(function (err) {
        reject(err.message);
      });

  });

}

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function sendEmail(Email, hash) {


    let linkGenerate = "http://moquire.maqware.com/change-password/" + hash + "/" + Email + "";

  //gmail smtp setting
  let transporter = nodeMailer.createTransport({
        service: 'gmail',
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
    auth: {
      user: 'maqware21@gmail.com',
      pass: 'maqware.1234'
    }
  });
//     let transporter = nodeMailer.createTransport({
//     host: 'email-smtp.ap-southeast-2.amazonaws.com',
//     port: 587,
//     //secure: true,
//     auth: {
//       user: 'AKIAVWYQOM65ZHUBLNCP',
//       pass: 'BDrPflDmxGqDXeXT6G5yGUikbVEcdozIB1F0xGtcDlfE'
//     }
//   });

  let mailOptions = {
    from:'Moquire "maqware21@gmail.com"',  // sender address
    to: Email, // list of receivers
    subject: "Reset Password Link", // Subject line
    //text: req.body.body, // plain text body
    html: '<b>Email reset Password Request </b><a href="' + linkGenerate + '">Please click to reset password</a>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      console.log('email send successfully');
    }

  });
  return true;

}



module.exports = router;
