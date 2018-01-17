var express = require('express');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');
var messagesController = require('../controllers/messages_controller');

api.post('/message', mdAuth.ensureAuth, messagesController.saveMessage);
api.get('/my-messages/:page?', mdAuth.ensureAuth, messagesController.getReceivedMessages);
api.get('/messages/:page?', mdAuth.ensureAuth, messagesController.getEmittedMessages);
api.get('/unviewed-messages', mdAuth.ensureAuth, messagesController.getUnViewedMessages);
api.get('/set-viewed-messages', mdAuth.ensureAuth, messagesController.setViewedMessages);

module.exports = api;