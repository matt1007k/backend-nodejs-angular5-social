'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

app.get('/', (req,res) =>{
	res.status(200).send({message: 'Servidor web nodejs... :P  '});
})
//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors


//rutas


module.exports = app;