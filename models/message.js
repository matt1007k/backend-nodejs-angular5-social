'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
	text: String,
	created_at: String,
	emitter: { type: mongoose.ObjectId, ref: 'User' },
	receiver: { type: mongoose.ObjectId, ref: 'User' }	
});

module.exports = mongoose.model('Message', MessageSchema);