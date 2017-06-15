let Votechain = require('../models/votechain');
let Vote      = require('../models/vote');
let voteController = require('./voteController');

function getGenesisVote(electionID) {
	let vote = new Vote();
	vote.index = 0;
	vote.previousHash = "0";
	vote.timestamp = 1465154705;
	vote.candidateID = 1;
	vote.electionID = electionID;
	vote.hash = "hashehmeupau";
	voteController.postVoteObject(vote);
	return vote;
}

function initializeVoteChain(electionID) {
	let votechain = new Votechain();
	votechain.electionID = electionID;
	votechain.votes = [getGenesisVote(electionID)];
	votechain.save(function(err) {
		if(err) return err;
		return votechain;
	});
	return votechain;
}

function getVoteChain(req, res) {
	let query = Votechain.find({});
	query.exec((err, votechain) => {
		if(err) res.send(err);
		res.json(votechain);
	});
}
module.exports = { initializeVoteChain, getVoteChain }

/* BACKUP METHODS 
function initializeVoteChain(req,res) {
	let votechain = new Votechain();
	votechain.electionID = req.body.electionID;
	votechain.votes = [getGenesisVote(req.body.electionID)];
	votechain.save(function(err) {
		if(err) res.send(err);
		res.json(votechain);
	});
}
*/