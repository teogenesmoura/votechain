let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let electionSchema = new Schema({
    name	   : String,
    candidates	   : [{	type: Schema.Types.ObjectId, ref: 'Voter'}],
    votechain 	   : { type: Schema.Types.ObjectId, ref: 'Votechain' }
});

module.exports = mongoose.model('Election', electionSchema);