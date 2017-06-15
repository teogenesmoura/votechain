let votechain = require('./votechainController');
let Election = require('../models/election');
let Voter = require('../models/voter');

function initializeElection(req, res) {
	let election = new Election();
	election.electionID = req.body.electionID;
	election.name		= req.body.name;
	election.voters		= null;
	election.votechain  = votechain.initializeVoteChain(req.body.electionID);
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
	let voter = Voter.findByName(req.body.name);
}
module.exports = { initializeElection, getElection };

