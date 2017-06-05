"use strict";
var Election = require('./election.js');
var u = require('./util.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http_port = process.env.HTTP_PORT || 3001;
var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
var election_list = [];
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/createElection', function(req,res) {
	var temp_election = new Election(req.body.name);
	election_list.push(temp_election);
	res.send(JSON.stringify(temp_election.getElectionID));
});

app.get('/elections', function(req,res) {
	res.send(JSON.stringify(election_list));
});

app.get('/', function(req,res) {
	res.send('ack');
});

app.listen(port);

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

