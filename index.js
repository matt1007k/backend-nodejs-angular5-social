'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;


//conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean-social', {useMongoClient: true})
		.then(() => {
			console.log('Conexión realizada correctamente');

			//crear servidor
			app.listen(port,() => {
				console.log('Servidor corriendo en http//:localhost:'+port)
			})
		}).catch(err => console.log(err));

			