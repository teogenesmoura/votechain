let Election = require('../models/election');
let Voter = require('../models/voter');
let Vote = require('../models/vote');
let Votechain = require('../models/votechain');
let votechainController = require('./votechainController');
let voteController = require('./voteController');
let voterController = require('./voterController');
let async = require('async');


/** initializes an election
* @returns JSON document with the election created or error
*/
function initializeElection(req, res) {
	let election = new Election();
	let votechain = new Votechain();
	votechain.election = election;
	votechain.save(function(err) {
		election.name		= req.body.name;
		election.voters		= [];
		election.votechain  = votechain.id;
		election.save(function(err) {
			if(err) res.send(err);
			res.json(election);
		});
	});
}

/** Retrieve election by name
* @params: electionName
* @returns: election JSON object if election exists, 'election not found' otherwise
*/
function getElectionByName(req, res) {
	async.parallel(
		{
			election: function(callback) {
				Election.findOne({'name' : req.params.electionName }, function(err,election) {
					callback(err, election);
				});
			}
		},
		function(e, r) {
			if(r.election == null) {
				res.send('election not found');
			} else { 
				res.render('electionRoom');
							}
		});
}
/**
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

function listElections(req, res) {
	var result;
	async.parallel(
	{
		elections: function(callback) {
			Election.find({}, function(err,elections) {
				callback(err, elections);
			});
		}
	},
	function(e, r) {
		if(r.elections === null){ 
			console.log('no elections to display');
			res.render('listElections', { 'elections': 'No elections to display' });
		} else {
			result = r.elections;
			res.render('listElections', {'elections': result });
			}
		}
	);
	
}
/**
* Adds a voter to an Election
* @param {string} electionName - the name of the election receiving the voter
* @param {string} voterName - the unique name of the voter to add
* @returns error if an error occurs or the new voter document hence the need of new: true
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
/**
* Casts a vote to a candidate in a given election
* @param {string} req.body.election - the name of the election receiving the vote
* @param {string} req.body.voter - the unique name of the voter who will cast the vote
* @param {string} req.body.candidate - the unique name of the candidate who will receive the vote
* @returns error if an error occurs or the updated votechain for that election
*/
function castVoteToCandidateInElection(req, res) {
	async.parallel(
	{
		voter: function(callback) {
			Voter.findOne({ 'name' : req.body.voter }, function(err,voter) {
				callback(err, voter);
			});
		},
		election: function(callback) {
			Election.findOne({ 'name' : req.body.election }, function(err,election) {
				callback(err, election);
			});
		},
		candidate: function(callback) {
			Voter.findOne({ 'name' : req.body.candidate }, function(err, candidate) {
				callback(err, candidate);
			});
		} 
	}, function(e, r) {
		if(r.voter === null || r.election === null || r.candidate === null) {
			res.send('Voter,Election or Candidate not found');
		} else {
			let mVote = new Vote();
			mVote.voter = r.voter;
			mVote.candidate = r.candidate;
			mVote.save(function(err, mVote){
				Votechain.findOneAndUpdate(
					{ 'election' : r.election },
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
/**
* Gets a chain of votes linked to a given election 
* @param {Number} req.body.electionID - the ID of the given Election
* @returns error if an error occur or the votechain instance requested
*/
function getVotechainFromElection(req, res) {
	let electionID = req.body.electionID;
}
module.exports = { initializeElection, getElection,
				   addVoterToElection, castVoteToCandidateInElection,
				   getElectionByName, listElections };
