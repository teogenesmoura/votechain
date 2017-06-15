let vote = require('./votechainController');
let Election = require('../models/election');

function postElection(req, res) {
	let election = new Election();
	election.electionID = req.body.electionID;
	election.name		= req.body.name;
	election.voters		= null;
	election.votechain  = null;

	election.save(function(err) {
		if(err) res.send(err);
		res.json(election);
	});
}
function getElection(req, res) {
	let query = Election.find({});
	query.exec((err, elections) => {
		if(err) res.send(err);
		res.send(elections);
	}); 
}
function addVoterToElection(req, res) {
	
}
module.exports = { postElection, getElection };