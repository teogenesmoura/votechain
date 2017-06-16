let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let votechainSchema = new Schema({
	election   : { type: Schema.Types.ObjectId, ref: 'Election', required: true},
    votes 	   : [{ type: Schema.Types.ObjectId, ref: 'Vote' }]
});

module.exports = mongoose.model('Votechain', votechainSchema);