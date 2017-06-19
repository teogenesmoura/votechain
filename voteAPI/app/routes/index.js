var express = require('express');
var	router 	= express.Router();
var vote = require('../controllers/voteController');
var election = require('../controllers/electionController');
var voter = require('../controllers/voterController');
var votechain = require('../controllers/votechainController');
var socket = require('../controllers/socketController');

router.route('/vote')
	  .post(vote.postVote)
	  .get(vote.getVotes);

router.route('/vote/:electionID')
	  .get(vote.getVotesByElectionID);

router.route('/election')
	  .post(election.initializeElection)
	  .get(election.getElection);

router.route('/election/addVoter')
	  .post(election.addVoterToElection);

router.route('/election/castVote')
 	  .post(election.castVoteToCandidateInElection);

router.route('/voter')
	  .post(voter.postVoter)
	  .put(voter.turnVoterIntoCandidate)
	  .get(voter.getVoters);

router.route('/voter/:name')
	  .get(voter.getVoterByName);

router.route('/votechain')
	  .get(votechain.getVoteChain);

router.route('/addPeer')
	  .post(socket.addPeer);

module.exports = router;