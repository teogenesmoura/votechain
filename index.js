"use strict";
var Election = require('./election.js');
var m_election = new Election();
var m_candidate = m_election.addCandidate("Barack Obama");
var n_candidate = m_election.addCandidate("Donald Trump");

console.log(m_candidate.ID === n_candidate.ID);

m_election.castVote(m_candidate,1);
m_election.castVote(n_candidate,2);
m_election.castVote(n_candidate,3);

console.log(m_election.votes);