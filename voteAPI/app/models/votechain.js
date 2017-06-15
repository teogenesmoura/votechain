let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let votechainSchema = new Schema({
	electionID : String,
    votes 	   : [{ type: Schema.Types.ObjectId, ref: 'Vote' }]
});

module.exports = mongoose.model('Votechain', votechainSchema);