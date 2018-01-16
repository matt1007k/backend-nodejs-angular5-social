'use strict'

var express = require('express');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');
var followController = require('../controllers/follows_controller');

api.post('/follow', mdAuth.ensureAuth, followController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, followController.deleteFollow);
api.get('/following/:id?/:page?', mdAuth.ensureAuth, followController.getFollowingUsers);
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, followController.getFollowedUsers);
api.get('/get-my-follows/:followed?', mdAuth.ensureAuth, followController.getMyFollows);

module.exports = api;