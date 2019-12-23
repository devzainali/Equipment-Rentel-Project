

const express = require('express');
const router = express.Router();
const auth = require('../../../../middleware/auth');
const checkrenter = require('../../../../middleware/checkrenter');
const Conversation = require('../../../../src/models/chat/conversation/conversation');
const Message = require('../../../../src/models/chat/chatMessage/chatMessage');

const User = require('../../../../src/models/user/user');
const Sender = require('../../../../src/models/user/user');
const Receiver = require('../../../../src/models/user/user');

Conversation.hasMany(Message, { foreignKey: 'conversationID' });
Conversation.belongsTo(User, { foreignKey: 'ownerID' });
Message.belongsTo(User, { foreignKey: 'senderID' });
//Message.belongsTo(Receiver, { foreignKey: 'receiverID' });

//get specfic two persons all conversation
router.get('/get', [auth, checkrenter], async (req, res) => {


    Conversation
        .findAndCountAll(
            {
                where: {
                    renterID: req.user.ID,
                },
                attributes: [['id', 'conversationID']],
                // include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"] }, { model: Message, include: [{ model: Sender, attributes: ["id", "firstName", "lastName", "image"], }, { model: Receiver, attributes: ["id", "firstName", "lastName", "image"] }] }],
                include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"] }, { model: Message, include: [{ model: User, attributes: ["id", "firstName", "lastName", "image"], }] }],
                order: [

                    [{ model: Message, },
                        'id', 'ASC'],

                ],
                distinct: true
                //attributes: ["id","companyID"],
                //include: [{model :Company, as:"company",attributes: ["id","firstName","lastName","image"],},{model :Message, as:"chat"}]                
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
                    message: "Renters all Conversations",
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