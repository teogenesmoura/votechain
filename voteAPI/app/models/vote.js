let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let voteSchema = new Schema({
	// index: Number,
	// name: String,  
	// previousHash: String,
	voterID : String,
	candidateID : String,
	electionID	: String,
	timestamp	: String
});

voteSchema.pre('save', next => {
	let timestamp = new Date().getTime() / 1000;
	if(!this.timestamp) {
		this.timestamp = timestamp;
	}
	next();
});

module.exports = mongoose.model('Vote', voteSchema);