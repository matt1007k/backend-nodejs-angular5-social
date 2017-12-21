'use strict'
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean-social', {useMongoClient: true})
		.then(() => {
			console.log('Conexión realizada correctamente')
		}).catch(err => console.log(err));