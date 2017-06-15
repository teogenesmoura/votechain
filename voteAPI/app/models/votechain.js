let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let votechainSchema = new Schema({
	votechainID : Number,
    name	   : String,
    votes 	   : [{ type: Schema.Types.ObjectId, ref: 'Vote'}]
});

module.exports = mongoose.model('Votechain', votechainSchema);