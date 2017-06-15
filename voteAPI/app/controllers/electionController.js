let votechain = require('./votechainController');
let Election = require('../models/election');

function initializeElection(req, res) {
	let election = new Election();
	election.electionID = req.body.electionID;
	election.name		= req.body.name;
	election.voters		= null;
	election.votechain  = votechain.initializeVoteChain;

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

module.exports = { initializeElection, getElection };