const express = require('express');
const router = express.Router();
const Conversation = require('../../../../../src/models/chat/conversation/conversation');
const Message = require('../../../../../src/models/chat/chatMessage/chatMessage');

router.post('/', async (req, res) => {

  if (!req.body.renterID) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: "renterID is required"
    })
  }

  if (!req.body.ownerID) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: "ownerID is required"
    })
  }
  if (!req.body.senderID) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: "senderID is required"
    })
  }

  if (!req.body.receiverID) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: "receiverID is required"
    })
  }



  Conversation.findOrCreate({
    where: {
      renterID: req.body.renterID,
      ownerID: req.body.ownerID,
    },
    defaults: { // set the default properties if it doesn't exist
      "renterID": req.body.renterID,
      "ownerID": req.body.ownerID,
    }
  }).then(function (result) {
    var AcceptObject = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) { // false if author already exists and was not created.

      res.json({
        status: 302,
        message: 'Already Exist',
      })
    } else {

      var message = {
        "conversationID": AcceptObject.id,
        "renterID": req.body.renterID,
        "ownerID": req.body.ownerID,
        "senderID": req.body.senderID,
        "receiverID": req.body.receiverID,
        "message": "hello",
      }

      var insertMessage = saveMessage(message);

      res.json({
        status: 200,
        message: 'created conversation',
      })

    }

  }).catch(function (err) {
    res.json({
      status: 500,
      message: err.message
    })
  });

});


function saveMessage(messageObject) {
  return new Promise(function (resolve, reject) {

    const createMessage = Message.create(messageObject).then(function (Message) {


      resolve(Message);

    }).catch(function (err) {
      reject(err.message);
    });

  }, function (err) {
    reject(err.message);
  });

}

module.exports = router;