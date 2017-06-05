/* Election defining file, uses the Decorator Design pattern */
"use strict";
var Voter = require("./user.js");
var u = require("./util.js");
var votechain = require("./votechain.js");
var exports = module.exports = {};

var Election = class Election {
	constructor(name){
		this.ID = u.generatePublicID(name);
		this.name = name;
		this.voters = [];
		this.candidates = [];
		this.votechain = new votechain();
	}
	get getElectionID() {
		return this.ID;
	}
	get getCandidates() {
	   	return this.candidates;
	}
	get getVoters() {
		return this.voters;
	}
	addVoter(name) {
		for(var voter in this.voters){
			if (voter.name == name) {
				return "voter already exists";
			}
		}
		var new_voter = new Voter((name));
		this.voters.push(new_voter);
		return new_voter;
	}

	/*TODO: refactor the following 2 getters into 1 method;
	possibly place them in User.js */
	getCandidateNameByID(candidateID) {
		for(var i = 0; i<this.candidates.length; i++) {
			if(candidateID == this.candidates[i].getCandidateID){
				return this.candidates[i].name;
			}
		}
	}
	getVoterNameByID(voterID) {
		for (var i = 0; i<this.voters.length; i++) {
			if(voterID == this.voters[i].getVoterID) {
				return this.voters[i].name;
			}
		}
	}
	/* adds candidates to election: 
	param: Voter instance
	return: Voter with Candidate attributes if sucessful, else
	error message  */
	addCandidate(voter) {
		//TODO: refactor into try/catch block
		if(typeof voter === 'string') {
			return "expects Voter Object";
		}
		for(var i = 0; i<this.voters.length;i++){
			if(voter.getVoterID == this.voters[i].getVoterID) {
				voter.setAsCandidate();
				this.candidates.push(voter);
				return this.candidates[this.candidates.length - 1];
			}
		}
		return false;
	}
	castVote(candidate,voter) {
		this.votechain.castNewVote(candidate,voter);
	}
	get votes() {
		return this.votechain.allVotes;
	}
}

module.exports = Election;


