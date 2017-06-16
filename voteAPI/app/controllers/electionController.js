let Election = require('../models/election');
let Voter = require('../models/voter');
let Vote = require('../models/vote');
let Votechain = require('../models/votechain');
let votechainController = require('./votechainController');
let voteController = require('./voteController');
let voterController = require('./voterController');
let async = require('async');

function initializeElection(req, res) {
	let election = new Election();
	let votechain = new Votechain();
	votechain.election = election;
	votechain.save(function(err) {
		election.name		= req.body.name;
		election.voters		= [];
		election.votechain  = votechain;
		election.save(function(err) {
			if(err) res.send(err);
			res.json(election);
		});
	});
}
/*
* Retrieves all elections
* @returns error if an error occurs or the a JSON document containing all elections
*/
function getElection(req, res) {
	let query = Election.find({});
	query.exec((err, elections) => {
		if(err) res.send(err);
		res.json(elections);
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
			Voter.findOne({ 'name' : req.body.voterName }, function(err,voter) {
				callback(err, voter);
			});
		}
	},
	function(e, r) {
		if(r.voter === null){ 
			res.send('Voter not found');
		} else {
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
		}
	);
}
/*
* Casts a vote to a candidate in a given election
* @param {string} req.body.electionName - the name of the election receiving the vote
* @param {string} req.body.voterName - the unique name of the voter who will cast the vote
* @param {string} req.body.candidateID - the ID of the candidate casting the vote
* @returns error if an error occurs or the updated votechain for that election
*/
function castVoteToCandidateInElection(req, res) {
	async.parallel(
	{
		voter: function(callback) {
			Voter.findOne({ 'name' : req.body.voterName }, function(err,voter) {
				callback(err, voter);
			});
		},
		election: function(callback) {
			Election.findOne({ 'name' : req.body.electionName }, function(err,election) {
				callback(err, election);
			});
		} 
	}, function(e, r) {
		if(r.voter === null || r.election === null) {
			res.send('Voter or Election not found');
			console.log("chega aqui null");
		} else {
			let mVote = new Vote();
			mVote.voterID = r.voter.id;
			mVote.candidateID = req.body.candidateID;
			mVote.save(function(err, mVote){
				Votechain.findOneAndUpdate(
					{ 'electionID' : r.election.id},
					{ $push: { votes: mVote }},
					{ new: true},
					function(err, votechain) {
						if(err) res.send(err);
						res.json(votechain);
						}			
					);
				});
			}
		}
	);
}
/* Gets a chain of votes linked to a given election 
* @param {Number} req.body.electionID - the ID of the given Election
* @returns error if an error occur or the votechain instance requested
*/
function getVotechainFromElection(req, res) {
	let electionID = req.body.electionID;

}
module.exports = { initializeElection, getElection, addVoterToElection, castVoteToCandidateInElection };

