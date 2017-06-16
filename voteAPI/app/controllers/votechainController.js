let Votechain = require('../models/votechain');
let Vote      = require('../models/vote');
let voteController = require('./voteController');
let async = require('async');

function getGenesisVote() {
	let vote = new Vote();
	vote.index = 0;
	vote.previousHash = "0";
	vote.timestamp = 1465154705;
	vote.candidateID = 1;
	vote.hash = "hashehmeupau";
	voteController.postVoteObject(vote);
	return vote;
}

function initializeVoteChain() {
	let votechain = new Votechain();
	votechain.votes = [getGenesisVote()];
	votechain.save(function(err) {
		if(err) return err;
		return votechain;
	});
	return votechain;
}
/*
* Gets all votechains in the db - testing purposes only
* @returns error if an error occurs or a JSON doc with all votechains in it
*/
function getVoteChain(req, res) {
	let query = Votechain.find({});
	query.exec((err, votechain) => {
		if(err) res.send(err);
		res.json(votechain);
	});
}
/*
* gets the Votechain object for a given election 
* params
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

module.exports = { getVoteChain, initializeVoteChain };
