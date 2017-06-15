var express = require('express');
var	router 	= express.Router();
var vote = require('../controllers/voteController');
var election = require('../controllers/electionController');

router.route('/vote')
	  .post(vote.postVote)
	  .get(vote.getVotes);

router.route('/vote/:electionID')
	  .get(vote.getVotesByElectionID);

router.route('/election')
	  .post(election.postElection)
	  .get(election.getElection);
// router.route('/election')
// 	  .post(election.postElection)
// 	  .get(election.getElection);

module.exports = router;