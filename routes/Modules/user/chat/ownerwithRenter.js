

const express = require('express');
const router = express.Router();
const auth = require('../../../../middleware/auth');
const checkOwner = require('../../../../middleware/checkowner');
const Conversation = require('../../../../src/models/chat/conversation/conversation');
const Message = require('../../../../src/models/chat/chatMessage/chatMessage');

const User = require('../../../../src/models/user/user');

// const Sender = require('../../../../src/models/user/user');
// const Receiver = require('../../../../src/models/user/user');

//  Conversation.hasMany(Message,{as:"chats",foreignKey: 'conversationID'});
//  Conversation.belongsTo(Seeker,{as:"Seekers",foreignKey: 'jobSeekerID'});
Conversation.hasMany(Message, { foreignKey: 'conversationID' });
Conversation.belongsTo(User, { foreignKey: 'renterID' });
Message.belongsTo(User, { foreignKey: 'senderID' });
// Message.belongsTo(Receiver, { foreignKey: 'receiverID' });


//get specfic two persons all conversation
router.get('/get', [auth, checkOwner], async (req, res) => {


    Conversation
        .findAndCountAll(
            {
                where: {
                    ownerID: req.user.ID,
                },
                attributes: [['id', 'conversationID',]],
                //attributes: ['id', 'conversationID','users.*', 'Message.*', [sequelize.fn('COUNT', 'Message.id'), 'PostCount']],
                include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"] }, { model: Message, include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"], }] }],
                order: [

                    [{ model: Message },
                        'id', 'ASC'],

                ],
                distinct: true
            }
        )
        .then(
            Conversation => {

                if (!Conversation) {
                    res.json({
                        status: 404,
                        message: "No Conversation found",
                        data: [],
                    });

                }

                res.json({
                    status: 200,
                    message: "owner all Conversations",
                    data: Conversation,
                });

            }
        )
        .catch(
            err => {
                res.json({
                    status: 500,
                    message: "Some error occur",
                    error: err.message
                });
            }
        );





});






module.exports = router;