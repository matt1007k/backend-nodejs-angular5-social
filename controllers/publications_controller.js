'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Publication = require('../models/publication');
var Follow = require('../models/follow');


function savePublication(req, res){
	var params = req.body;

	if (!params.text) res.status(200).send({message: "Debes de enviar un texto"});

	var publication = new Publication();
	publication.text = params.text;
	publication.file = null;
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((error, publicationStored) =>{
		if (error) return res.status(500).send({message: "Error al guardar la publicación"});
		if (!publicationStored) return res.status(404).send({message: "La publicación no se guardado"});

		return res.status(200).send({publication: publicationStored});
	})
}

function getPublications(req, res) {
	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Follow.find({user: req.user.sub}).populate('followed').exec((error, follows) => {
		if (error) return res.status(500).send({message: "Error al guardar la publicación"});

		var follows_clean = [];
		follows.forEach((follow) => {
			follows_clean.push(follow.followed);
		});

		Publication.find({user: {'$in': follows_clean}}).sort('created_at').populate('user').paginate(page, itemsPerPage, (error, publications, total) =>{
			if (error) return res.status(500).send({message: "Error al devolver las publicaciones"});
			if (!publications) return res.status(404).send({message: "No hay publicaciones"});
			
			return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				publications
			});

		});

	});
}

function getPublication(req, res){
	var publicationId = req.params.id;

	Publication.findById(publicationId, (error, publication) => {
		if (error) return res.status(500).send({message: "Error al devolver la publicación"});
		if (!publication) return res.status(404).send({message: "No existe esa publicación"});
		
		return res.status(200).send({publication});
	})
}

function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({user: req.user.sub, '_id': publicationId}).remove(error => {
		if (error) return res.status(500).send({message: "Error al borrar la publicación"});
		
		return res.status(200).send({message: "Publicación eliminada"});
	})
}
// Subir archivo de imagen/ Avatar del ususario
function uploadImage(req, res){
	var publicationId = req.params.id;	
	
	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif") {
			
			Publication.findOne({user: req.user.sub, '_id': publicationId}).exec((error, publication) =>{
				if (publication) {
					// Actualizar documento de la publicación
					Publication.findByIdAndUpdate(publicationId, { file: file_name}, { new: true }, (error, publicationUpdated) =>{
						if (error) return res.status(500).send({message: "Error en la petición"});
						if (!publicationUpdated) return res.status(404).send({message: "No se ha podido actualizar la publicación"});

						return res.status(200).send({publication: publicationUpdated});
					})
				}else{
					return removeFilesUploads(res, file_path, "No tienes permiso para actualizar está publicación");
				}

			});
			
		}else{
			return removeFilesUploads(res, file_path, "La extensión no es válida");
		}

	}else{
		return res.status(200).send({message:"No se a subido ninguna imagen"});
	}


}

function removeFilesUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+ image_file;

	fs.exists(path_file, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: "No existe la imagen...."});
		}
	})
}


module.exports = 
{
	savePublication,
	getPublications,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile,
}
