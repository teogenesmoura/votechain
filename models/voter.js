let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var voterSchema = new Schema({ 
	email: {type: String, unique: true},
	password: String,
	passwordResetToken: String,
	passwordResetExpires: Date,
	name: {
		type: String,
		required: true
	},
	isCandidate:  Boolean,
	createdAt: { type: Date, default: Date.now }
});

voterSchema.pre('save', next => {
	now = new Date();
	if(!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

module.exports = mongoose.model('Voter', voterSchema);