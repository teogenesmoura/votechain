let Vote = require('../models/vote');
/*
* GET /vote route to retrieve all votes in all elections
*/
function getVotes(req, res) {
	let query = Vote.find({});
	query.exec((err, votes) => {
		if(err) res.send(err);
		res.json(votes);
	});
}
/*
* GET /vote/:electionID route to retrieve all votes in a given election
*/
function getVotesByElectionID(req, res) {
	let query = Vote.find({ electionID: req.params.electionID });
	query.exec((err, votes) => {
		if(err) res.send(err);
		res.json(votes);
	});
}
/*
* POST /vote route to cast a new vote for a given election
*/
function postVote(req, res) {
	  	let vote = new Vote();
	  	vote.voterID 	 = req.body.voterID;
	  	vote.candidateID = req.body.candidateID;
		vote.electionID  = req.body.electionID;
		vote.save(function(err) {
			if(err) {
				res.send(err);
			}
		res.json({ vote });
	});
}
function postVoteObject(mVote) {
	mVote.save(function(err) {
		if(err) return err;
		return mVote;
	});
}
function getNewVoteInstance() {
	return new Vote();
}

module.exports = { postVote, getVotes, getVotesByElectionID, postVoteObject, getNewVoteInstance };