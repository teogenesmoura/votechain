let votechain = require('./votechainController');
let Election = require('../models/election');
let Voter = require('../models/voter');
let voterController = require('./voterController');
let async = require('async');

function initializeElection(req, res) {
	let election = new Election();
	election.electionID = req.body.electionID;
	election.name		= req.body.name;
	election.voters		= [];
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
/*
* Adds a voter to an Election
* @param {string} electionName - the name of the election receiving the voter
* @param {string} voterName - the unique name of the voter to add
* @returns error if an error occurs or the new voter document (hence the need of {new: true})
*/
function addVoterToElection(req, res) {
	async.parallel(
	{
		voter: function(callback) {
			Voter.findOne({ 'name' : req.body.voterName}, function(err,voter) {
				callback(err, voter);
			});
		}
	},
	function(e, r) {
		Election.findOneAndUpdate(
			{'name': req.body.electionName },
			{$push: { voters: r.voter }},
			{new: true},
			function(err, voter) {
				if(err) res.send(err);
				res.send(voter);
				}
			);
		}
	);
}
module.exports = { initializeElection, getElection, addVoterToElection };

