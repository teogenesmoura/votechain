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
	  .post(election.createElection)
	  .get(election.getElection);
	  
router.route('/election/create')
	  .get(election.getElectionCreationForm);

router.route('/election/:electionName')
	  .get(election.getElectionByName);

router.route('/election/addCandidatesToElection')
	  .post(election.addCandidatesToElection);

router.route('/election/castVote')
 	  .post(election.castVoteToCandidateInElection);

router.route('/voter')
	  .post(voter.postVoter)
	  .put(voter.turnVoterIntoCandidate)
	  .get(voter.getVoters);

router.route('/voterSignUp')
	  .get(voter.inputForm);

router.route('/voter/:name')
	  .get(voter.getVoterByName);

router.route('/votechain')
	  .get(votechain.getVoteChain);

router.route('/client')
	  .get(function(req,res) {
	  		res.render('client', {ROOT_URL: process.env.ROOT_URL });
		});

router.route('/listElections')
	  .get(election.listElections);

module.exports = router;