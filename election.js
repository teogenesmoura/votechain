/* Election defining file, uses the Decorator Design pattern */
"use strict";
var Votechain = require("./votechain.js");
var Candidate = require("./candidate.js");

var Election = class Election {
	constructor(name){
		this.name = name;
		this.candidates = [];
		this.createElection();
	}
	createElection() {
	 	this.votes = Votechain.createVotechain();
	}	
	get name(){
		return this._name;
	}
	set name(name){
		this._name = name;
	}
	get getCandidates() {
	   	return this.candidates;
	}
	set addCandidates(name) {
		var n_candidate = Candidate.createCandidate(name);
		this.candidates.push(n_candidate);
	}
}

var m_election = new Election("eleicao teste");
m_election.addCandidates = "barack";
m_election.addCandidates = "jose";
var current_cand = m_election.getCandidates;
console.log(current_cand);

