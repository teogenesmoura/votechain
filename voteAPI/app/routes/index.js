var express = require('express');
var	router 	= express.Router();
var vote = require('../controllers/voteController');
var election = require('../controllers/electionController');
var voter = require('../controllers/voterController');
var votechain = require('../controllers/votechainController');

router.route('/vote')
	  .post(vote.postVote)
	  .get(vote.getVotes);

router.route('/vote/:electionID')
	  .get(vote.getVotesByElectionID);

router.route('/election')
	  .post(election.initializeElection)
	  .get(election.getElection);

router.route('/voter')
	  .post(voter.postVoter)
	  .get(voter.getVoters);

router.route('/voter/:name')
	  .get(voter.getVoterByName);

module.exports = router;