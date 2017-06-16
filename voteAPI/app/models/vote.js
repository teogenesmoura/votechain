let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let voteSchema = new Schema({
	index: Number,
	previousHash: String,
	hash: String,
	voter       : { type: Schema.Types.ObjectId, ref: 'Voter'},
	candidate	: { type: Schema.Types.ObjectId, ref: 'Voter'}, 
	election	: { type: Schema.Types.ObjectId, ref: 'Election' },
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