"use strict";
var u = require("./util.js");
module.exports = exports = {};

class User {
	constructor(name) {
		this.name = name;
		this.ID = u.generatePublicID(name);
	}
	set setName(name){
		this.name = name;
	}
	get getName() {
		return this.name;
	}
}
class Voter extends User {
	constructor(name) {
		super(name);
		this.voterID = u.generatePublicID(name);
	}
	get getVoterID(){
		return this.voterID;
	}
	setAsCandidate(){
		this.candidate = true;
		this.candidateID = u.generatePublicID(this.name);
	}
	get getCandidateID() {
		return this.candidateID;
	}
	get getName() {
		return super.getName;
	}
}

module.exports = Voter;