"use strict";
var Election = require('./election.js');
var m_election = new Election();
m_election.castVote("Barack",1);
m_election.castVote("Jose",2);
console.log(m_election.votes);