const express = require('express');
const user = require('../routes/Modules/user/user');
const category = require('../routes/Modules/admin/categories/category');

const equipment = require('../routes/Modules/user/owner/equipment/equipments');
const equipmentDetail = require('../routes/Modules/user/owner/equipment/equipmentDetail/equipmentDetail');

//rating get and add
const rating = require('../routes/Modules/user/owner/rating/rating');

//renter Enquire Equipmemt
const enquirEquipment = require('../routes/Modules/user/renter/submitEquipmentRequest/enquireEquipment');

//get owner Pending Requests

const PendingRequests = require('../routes/Modules/user/owner/requests/pendingRequests');

//Owner Accept Request
const AcceptRequests = require('../routes/Modules/user/owner/requests/acceptRequests');

//Renter Accepted Request listing
const AcceptedRequests = require('../routes/Modules/user/renter/acceptedRequests/acceptedRequests');

const Booked = require('../routes/Modules/user/owner/requests/bookedListing');

//create conversation
const createConversation = require('../routes/Modules/user/chat/createConversation/createConversation');

//insert message
const chatInsertMessage = require('../routes/Modules/user/chat/chat');

//GetAllChatMessages
const GetAllChatMessages = require('../routes//Modules/user/chat/getchat/getchat');

//user chat
const renterWithOwner = require('../routes/Modules/user/chat/renterWithOwner');
const OwnerWithRenter = require('../routes/Modules/user/chat/ownerwithRenter');


//renter order payment 
const order = require('../routes/Modules/user/renter/payment/order/order');

const paypal = require('../routes/Modules/user/owner/payout/paypalCreditional/paypalCreditional');


//deployment 
const deployment = require('../routes/Modules/user/renter/checkDeployment/checkDeployment')

const returnBack = require('../routes/Modules/user/owner/equipment/returnback/returnBackEquipment');

//forgot Password
const FotgotPassword = require('../routes/Modules/user/forgotPassword/forgotPassword');

//Notification Status Change

const NotificationStatus = require('../routes/Modules/user/NotificationStatusChange/notificationStatusChnage')

//renter Booked Equipment listing

const RenterBookings = require('../routes/Modules/user/renter/bookedListing/bookedListing')

//top Rated Equipment

const RatedListing = require('../routes/Modules/user/generalPages/topRatedEquipment');

//catagory Equipment

const catagoryEquipmentListing = require('../routes/Modules/user/generalPages/categoryEquipment');

//renter Save Equipment

const SaveEquipment = require('../routes/Modules/user/renter/saveEquipments/saveEquipment');

//User Notification

const Notifications =  require('../routes/Modules/user/notifications/Notification');

//Search Equipment

const Search =  require('../routes/Modules/user/owner/equipment/searchEquipment/searchEquipment');
const PublicProfile =  require('../routes/Modules/user/generalPages/ownerProfile');

const RenterPending =  require('../routes/Modules/user/renter/renterPendingRequest/renterPendingRequest');
const RenterExpenses =  require('../routes/Modules/user/renter/renterExpenses/renterExpenses');

//admin routes

const Faq =  require('../routes/Modules/admin/faqs/faqs');

const Page =  require('../routes/Modules/admin/pages/pages');

const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/category', category);
  app.use('/api/user', user);
  app.use('/api/user/password', FotgotPassword);
  app.use('/api/owner/equipment', equipment);
  app.use('/api/owner/equipment/detail', equipmentDetail);
  app.use('/api/owner/rating', rating);
  app.use('/api/renter/enquire', enquirEquipment);
  app.use('/api/owner/equipment/pending', PendingRequests);
  app.use('/api/owner/equipment/acceptRequest', AcceptRequests);
  app.use('/api/owner/equipment/booked', Booked);
  app.use('/api/renter/acceptedRequest', AcceptedRequests);
  app.use('/api/renter/Bookings', RenterBookings);
  app.use('/api/create/Conversation',createConversation);
  app.use('/api/chat', chatInsertMessage);
  app.use('/api/chat/AllMessages', GetAllChatMessages);  
  app.use('/api/chat/renterWithOwner', renterWithOwner);
  app.use('/api/chat/ownerWithRenter', OwnerWithRenter);
  app.use('/api/order',order);
  app.use('/api/owner/paypal', paypal);
  app.use('/api/order/deployment',deployment);
  app.use('/api/owner/equipment/return', returnBack);
  app.use('/api/NotificationStatus/', NotificationStatus);
  app.use('/api/topRated/', RatedListing);
  app.use('/api/Equipment', catagoryEquipmentListing);
  app.use('/api/SaveEquipment', SaveEquipment);
  app.use('/api/Notification', Notifications);
  app.use('/api/Search', Search);

  app.use('/api/public/ownerProfile', PublicProfile);

  app.use('/api/renter/PendingRequestListing', RenterPending);

  app.use('/api/renter/RenterExpenses', RenterExpenses);
  app.use('/api/admin/Faq',Faq);
  app.use('/api/admin/Page',Page);

  app.use(error);
}