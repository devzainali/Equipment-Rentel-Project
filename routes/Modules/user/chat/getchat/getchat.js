

const express = require('express');
const router = express.Router();
const Message = require('../../../../../src/models/chat/chatMessage/chatMessage');

const User = require('../../../../../src/models/user/user');

//  Conversation.belongsTo(Seeker,{as:"Seeker",foreignKey: 'jobSeekerID'});
//  Conversation.hasMany(Message,{as:"chats",foreignKey: 'conversationID'});
//  Message.belongsTo(Seeker,{as:"Seeker",foreignKey: 'seekerID'});
//  Message.belongsTo(Company,{as:"Company",foreignKey: 'companyID'});

Message.belongsTo(User, { as: "send", foreignKey: 'senderID' });
Message.belongsTo(User, { as: "receive", foreignKey: 'receiverID' });


//get specfic two persons all conversation
router.get('/get', async (req, res) => {

    if (!req.query.ownerID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "ownerID is required"
        });
    }
    if (!req.query.renterID) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "renterID is required"
        });
    }


    Message
        .findAndCountAll(
            {
                where: {
                    ownerID: req.query.ownerID,
                    renterID: req.query.renterID,
                },
                include: [{ model: User, as: "send", attributes: ["id", "firstName", "lastName", "image"] }, { model: User, as: "receive", attributes: ["id", "firstName", "lastName", "image"] }],
                order: [
                    ['id', 'DESC'],
                ],
                distinct: true
            }
        )
        .then(
            Message => {

                if (!Message) {
                    res.json({
                        status: 404,
                        message: "No chat found",
                        data: [],
                    });

                }

                res.json({
                    status: 200,
                    message: "all Conversations",
                    data: Message,
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