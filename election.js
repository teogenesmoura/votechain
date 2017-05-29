/* Election defining file, uses the Decorator Design pattern */
"use strict";
var Candidate = require("./candidate.js");
var votechain = require("./votechain.js");
var exports = module.exports = {};

var Election = class Election {
	constructor(name){
		this.name = name;
		this.candidates = [];
		this.votechain = new votechain();
	}
	get candidateName(){
		return this.name;
	}
	set candidateName(name){
		this.name = name;
	}
	get getCandidates() {
	   	return this.candidates;
	}
	set addCandidates(name) {
		var n_candidate = Candidate.createCandidate(name);
		this.candidates.push(n_candidate);
	}
	castVote(candidate,VoterID) {
		this.votechain.castNewVote(candidate,VoterID);
	}
	get votes() {
		return this.votechain.allVotes;
	}
}

module.exports = Election;


