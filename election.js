/* Election defining file, uses the Decorator Design pattern */
"use strict";
var Votechain = require("./votechain.js");
var Candidate = require("./candidate.js");

var Election = class Election {
	constructor(name){
		this.name = name;
		this.candidates = [];
		this.votes = new Votechain();
	}	
	get name(){
		return this._name;
	}
	set name(name){
		this._name = name;
	}
	candidates() {
	   	return this.candidates;
	}
	addCandidate(name) {
		var n_candidate = new Candidate(name);
		this.candidates.push(n_candidate);
		return n_candidate;
	}
	castVote(candidate,voterID) {
		this.votes.castNewVote(candidate,voterID);
	}
}

module.exports = Election;

