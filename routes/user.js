'use strict' 

var express = require('express');
var UserController = require('../controllers/users_controller');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/login', UserController.login);
api.post('/register',UserController.saveUser);
api.get('/user/:id',mdAuth.ensureAuth, UserController.getUser);
api.get('/users/:page?',mdAuth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;
