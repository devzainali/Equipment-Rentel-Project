const express = require('express');
const router = express.Router();

const { validate, validateUpdate } = require('../../../../src/validations/chat/chat');
const Conversation = require('../../../../src/models/chat/conversation/conversation');
const Message = require('../../../../src/models/chat/chatMessage/chatMessage');

const User = require('../../../../src/models/user/user');

var Pusher = require('pusher');
const config = require('config');

let settingPusher = config.get('chat');
//console.log(settingPusher);

var channels_client = new Pusher(settingPusher);

Message.belongsTo(User, { foreignKey: 'renterID' });
Message.belongsTo(User, { foreignKey: 'ownerID' });

router.post('/', async (req, res) => {

  var chat = {
    "renterID": req.body.renterID,
    "ownerID": req.body.ownerID,
    "senderID": req.body.senderID,
    "receiverID": req.body.receiverID,
    "message": req.body.message,
  }

  const { error } = validate(chat);
  if (error) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {

    var initializeSendNotification = checkConversation(req.body.ownerID, req.body.renterID);//
    initializeSendNotification.then(function (ConversationBetweenID) {
      console.log(ConversationBetweenID);
      var message = {
        "conversationID": ConversationBetweenID,
        "renterID": req.body.renterID,
        "ownerID": req.body.ownerID,
        "senderID": req.body.senderID,
        "receiverID": req.body.receiverID,
        "message": req.body.message,
      }


      var initializeMessage = saveMessage(message);//
      initializeMessage.then(function (messageObject) {

        Message.findOne({
          where: {
            id: messageObject.id,
          },
          include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"], }, { model: User, attributes: ["id", "firstName", "lastName", "image"] }],
        }).then(Message => {
          channels_client.trigger('moquirechat', 'my-event', Message, function (error, request, response) {
            //console.log(response);

          });

        });

        // var conversation = 'my-event';
        // channels_client.trigger('moquirechat', 'my-event', messageObject,function( error, request, response ){
        //   //console.log(response);

        // });

        res.json({
          status: 200,
          message: 'Successfully Added',
          data: Message
        })

      }, function (err) {
        res.json({
          status: 500,
          message: "Some error occurs",
          error: err.message
        });
      })


      console.log('Chat sends successfully')

    }, function (err) {
      console.log('Chat sends fails')
    })






  }

});

//get specfic two persons all conversation
router.post('/get', async (req, res) => {

  var chat = {
    "renterID": req.body.renterID,
    "ownerID": req.body.ownerID,
  }

  const { error } = validateUpdate(chat);
  if (error) {
    res.json({
      status: 403,
      error: 'Validation Error Occur',
      message: error.details[0].message
    })
  } else {


    var initializeSendNotification = checkConversation(req.body.ownerID, req.body.renterID);//
    initializeSendNotification.then(function (ConversationBetweenID) {
      if (ConversationBetweenID == false) {
        res.json({
          status: 404,
          message: 'No data Found',
          data: []
        })
      }

      var message = {
        where: {
          conversationID: ConversationBetweenID,
        },
        include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"] }, { model: User, attributes: ["id", "firstName", "lastName", "image"] }]
      }


      var initializeMessage = getChat(message);//
      initializeMessage.then(function (messageObject) {
        res.json({
          status: 200,
          message: 'Chat Conversation',
          data: messageObject
        })

      }, function (err) {
        res.json({
          status: 500,
          message: "Some error occur",
          error: err.message
        });
      })


      console.log('Chat sends successfully')

    }, function (err) {
      console.log('Chat sends fails')
    })







  }

});


function checkConversation(ownerID, renterid) {
  return new Promise(function (resolve, reject) {


    Conversation.findOrCreate({
      where: {
        renterID: renterid,
        ownerID: ownerID,
      },
      defaults: { // set the default properties if it doesn't exist
        "renterID": renterid,
        "ownerID": ownerID,
      }
    }).then(function (result) {
      var AcceptObject = result[0], // the instance of the author
        created = result[1]; // boolean stating if it was created or not

      if (!created) { // false if author already exists and was not created.

        resolve(AcceptObject.id);
      }

      resolve(AcceptObject.id);

    }).catch(function (err) {
      reject(err.message)
    });


  }, function (err) {
    reject(err.message);
  })

}




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

function getChat(messageObject) {
  return new Promise(function (resolve, reject) {

    const createMessage = Message.findAll(messageObject).then(function (Message) {
      if (!Message) {
        reject(false);
      }
      resolve(Message);

    }).catch(function (err) {
      reject(err.message);
    });

  }, function (err) {
    reject(err.message);
  });

}




module.exports = router;