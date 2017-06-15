let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let voterSchema = new Schema({ 
	name: 	String,
	isCandidate:  Boolean, 
	createdAt: { type:Date, default: Date.now }
});

voterSchema.pre('save', next => {
	now = new Date();
	if(!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

module.exports = mongoose.model('Voter', voterSchema);