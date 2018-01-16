'use strict'

var multipart = require('connect-multiparty');
var md_uploads = multipart({ uploadDir: './uploads/publications' });

var express = require('express');
var api = express.Router();

var publicationController = require('../controllers/publications_controller');
var mdAuth = require('../middlewares/authenticated');

api.post('/publication',mdAuth.ensureAuth, publicationController.savePublication);
api.get('/publications/:page?',mdAuth.ensureAuth, publicationController.getPublications);
api.get('/publication/:id',mdAuth.ensureAuth, publicationController.getPublication);
api.delete('/publication/:id',mdAuth.ensureAuth, publicationController.deletePublication);
api.post('/upload-image-pub/:id',[mdAuth.ensureAuth, md_uploads], publicationController.uploadImage);
api.get('/get-image-pub/:imageFile', publicationController.getImageFile);


module.exports = api;