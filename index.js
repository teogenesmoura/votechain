"use strict";
var Election = require("./election");
var http_port = process.env.HTTP_PORT || 3001;
var p2p_port = process.env.P2P_PORT || 6001;

var m_election = Election.createElection("eleicao teste");
m_election.addCandidates = "barack";
m_election.addCandidates = "jose";
var current_cand = m_election.getCandidates;
console.log(current_cand);
