'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Message = require('../models/message');
var Follow = require('../models/follow');


function saveMessage(req, res){
	var params = req.body;

	if (!params.text || !params.receiver) return res.status(200).send({message: "Envia los datos necesarios"});

	var message = new Message();
	message.emitter = req.user.sub;
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().unix();
	message.viewed = 'false';

	message.save((error, messageStored) =>{
		if (error) return res.status(500).send({message: "Error en la petición"});
		if (!messageStored) return res.status(404).send({message: "Error al enviar el mensaje"});		
		return res.status(200).send({message: messageStored});
	}); 
}

function getReceivedMessages(req, res){
	var userId = req.user.sub;
	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({receiver: userId}).populate('emitter','_id name surname image nick').paginate(page, itemsPerPage, (error, messages, total) =>{
		if (error) return res.status(500).send({message: "Error en la petición"});
		if (!messages) return res.status(404).send({message: "No hay mensajes"});		
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});
	}); 
}

function getEmittedMessages(req, res){
	var userId = req.user.sub;
	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({emitter: userId}).populate('emitter receiver','_id name surname image nick').paginate(page, itemsPerPage, (error, messages, total) =>{
		if (error) return res.status(500).send({message: "Error en la petición"});
		if (!messages) return res.status(404).send({message: "No hay mensajes"});		
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});
	}); 
}

function getUnViewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver: userId, viewed: 'false'}).exec((error, count) =>{
		if (error) return res.status(500).send({message: "Error en la petición"});

		return res.status(200).send({
			'unviewed': count
		});
	});
} 

function setViewedMessages(req, res){
	var userId = req.user.sub;

	Message.update({receiver: userId, viewed: 'false'}, { viewed: 'true'}, {'multi': true},(error, messageUpdate) =>{
		if (error) return res.status(500).send({message: "Error en la petición"});
		
		return res.status(200).send({ messages: messageUpdate });

	});
}

module.exports = {
	saveMessage,
	getReceivedMessages,
	getEmittedMessages,
	getUnViewedMessages,
	setViewedMessages,
}