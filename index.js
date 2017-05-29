"use strict";
var Election = require('./election.js');
var http_port = process.env.HTTP_PORT || 3001;
var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

var m_election = new Election();
var voter_1 = m_election.addVoter("Voter 1");
var voter_2 = m_election.addVoter("Voter 2");
var voter_3 = m_election.addVoter("Voter 2");
var barack = m_election.addVoter("Barack Obama");
console.log(m_election.getVoters);

var m_candidate = m_election.addCandidate(barack);
console.log(m_candidate);
console.log(m_election.getCandidates);

// var n_candidate = m_election.addVoter("Donald Trump");

// m_candidate = m_election.addCandidate(m_candidate);
// console.log(m_candidate.candidateID);
// n_candidate = m_election.addCandidate(n_candidate);

// m_election.castVote(m_candidate,voter_1);
// m_election.castVote(n_candidate,voter_2);
// m_election.castVote(n_candidate,voter_3);

// console.log(m_election.votes);