"use strict";
var Election = require('./election.js');
var u = require('./util.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http_port = process.env.HTTP_PORT || 3001;
var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
var electionList = [];
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/createElection', function(req,res) {
	if(typeof req.body.name !== 'string') {
		res.send('election name should be string');
	}
	let temp_election = new Election(req.body.name);
	electionList.push(temp_election);
	console.log(JSON.stringify(temp_election));
	res.send(JSON.stringify(temp_election));
});

app.get('/getElectionNameByID/:ID', function(req,res) {
	if(typeof req.params.ID !== 'string') {
		res.send('param should be string');
	}
	let electionRetrieved = electionList.find((e) => e.getElectionID === req.params.ID);
	if(electionRetrieved != 'undefined') {
		res.send(electionRetrieved.getElectionName);
	}
	res.send('nothing found');	
});

// app.post('/createVoter', function(req,res) {
// 	let election = getElection(req.body.name);
// 	if (typeof election !== 'object') {
// 		res.send('Election does not exist!');
// 	}
// });

// app.post('/createCandidate', function(req,res) {

// });

// app.post('/castVote', function(req,res){

// });

// app.get('/election/:name', function(req,res) {
// 	res.send(electionExists(req.params.name));
// });

// app.get('/elections', function(req,res) {
// 	res.send(JSON.stringify(electionList));
// });

// app.get('/getElectionByID/:ID', function(req,res) {
// 	if(electionList.find((e) => e.getElectionID === req.params.ID)) {
// 		res.send(e.getElectionName);
// 	}
// });

app.listen(port, function() {	
	console.log("listening on port" + port);
});

var electionExists = function(electionName) {
	console.log(electionName);
	return electionList.find((e) => e.getElectionName === electionName);
}

module.exports = app;
// var m_election = new Election();
// var voter_1 = m_election.addVoter("Voter 1");
// var voter_2 = m_election.addVoter("Voter s");
// var voter_3 = m_election.addVoter("Voter 3");
// var barack = m_election.addVoter("Barack Obama");
// var donald = m_election.addVoter("Donald Trump");

// console.log("Voters registered to the election:");
// console.log(m_election.getVoters);
// console.log("\n");

// var n_candidate = m_election.addCandidate(donald);
// var m_candidate = m_election.addCandidate(barack);

// console.log("Candidates registered to the election:");
// console.log(m_election.getCandidates);
// console.log("\n");

// m_election.castVote(m_candidate,voter_1);
// m_election.castVote(n_candidate,voter_2);

// for(var i = 0; i<m_election.votes.length;i++){
// 	u.votePrettyPrinter(m_election,m_election.votes[i]);
// }

