//TODO: fix _addCandidateToElection, it's returning null when it shouldn't 
let Election = require('../models/election');
let Voter = require('../models/voter');
let Vote = require('../models/vote');
let Votechain = require('../models/votechain');
let votechainController = require('./votechainController');
let voteController = require('./voteController');
let voterController = require('./voterController');
let async = require('async');

/** initializes an election. Elections are considered active by default.
* @params: Parameters are in the body of req and are the following:
* candidates (Array of Strings): name of candidates
* name (String) : name of the election
* voter (String) : encrypted representation of a voter e.g "61E_ZHCGAsEK-DtVAAAA"
* @returns JSON document with the election created or error
*/
function createElection(req, res) {
	let election = new Election();
	let votechain = new Votechain();
	if(!req.body.electionName) {
		res.send("Invalid Election name");
	} else {
		votechain.election = election;
		votechain.save(function(err) {
			election.name		= req.body.electionName;
			election.votechain  = votechain.id;
			election.isActive = true;
			election.save(function(err) {
				if(err) { res.send(err); }
				res.send("createElection success");
			});	
		});
	}
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
				res.render('electionRoom', {election: r.election});
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

function getElectionCreationForm(req, res) {
	res.render('createElection');
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
			console.log("result: " + r.elections);
			res.render('listElections', {'elections': result });
			}
		}
	);
}
/** Receives the name of the candidate and returns it's Voter instance
* @params (String): candidateName
* @returns: Promise containing the Voter object or error
**/
function findVoter(candidateName) {
	return new Promise(function(resolve,reject) {
		Voter.findOne({'name': candidateName}, function(err,voter) {
			if(err || !voter) {
				reject(err);
			} else {
				resolve(voter);
			}
		});
	});
}
/** Mounts an array of Voter instances given the name of the candidates
* @params: 
* candidateName - Array of Strings containing the name of the candidates e.g ["Barack Obama","George Bush"]
* electionName - String containing the name of the election to witch persist candidates
* @returns: Promise with Election instance created
**/

function addCandidateToElection(electionName, candidateName) {
	return findVoter(candidateName).then(function(voter) {
		return new Promise(function(resolve,reject) {
			Election.findOneAndUpdate(
				{'name' : electionName},
				{$push: {candidates : voter }},
				{new: true},
				function(err, election) {
					if(err) {
						reject(err);
					} else {
						resolve(!!election);
					}
				});
			});
		});
}
/**
* Adds a voter to an Election
* @param {string} electionName - the name of the election receiving the voter
* @param {string} voterName - the unique name of the voter to add
* @returns error if an error occurs or the new voter document hence the need of new: true
*/
function addCandidatesToElection(req,res) {
	let electionName = req.body.electionName;
	let candidates = req.body.candidates;
	let addedCandidatesSucessfully = true;
	let candidatePromiseArray = [];
	for(let i=0;i<candidates.length;i++) {
		candidatePromiseArray.push(addCandidateToElection(electionName, candidates[i]));
	}
	Promise.all(candidatePromiseArray)
	.then(function(results) {
		console.log(results);
		res.send("Election created sucessfully");
	})
	.catch(function(error) {
		console.log("entrou em error:" + error);
		res.send("Election not created sucessfully");
	});
}
function changeElectionStatus(req,res) {
	let electionName = req.body.electionName;
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
* Receives an election name through req.body.electionName and returns whether it is active or not
* @param {String} req.body.electionName - the name of given Election
* @returns true if election is active, false otherwise
*/
function isElectionActive(req,res) {
	Election.findOne({'name': req.body.electionName}).then(function(election) {
		if(election.isActive) {
			res.json("active");
		} else {
			res.json("not active");
		}
	});
}
/**
* Gets a chain of votes linked to a given election 
* @param {Number} req.body.electionID - the ID of the given Election
* @returns error if an error occur or the votechain instance requested
*/
function getVotechainFromElection(req, res) {
	let electionID = req.body.electionID;
}
//createElectionAndAddCandidates
module.exports = { createElection, getElection,	addCandidatesToElection,
							 		 castVoteToCandidateInElection, getElectionByName, 
							 		 listElections, getElectionCreationForm, isElectionActive };
