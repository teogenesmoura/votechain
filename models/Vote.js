var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
	index: Number,
	name: String,
	voterID: String,
	candidateID: String,
	previousHash: String,
	timestamp: String,
	hash: String
});