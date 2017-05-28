"use strict";
var exports = module.exports = {};

var Candidate = class Candidate{
	constructor(name){
		this.name = name;
		this.politicalAffiliation = null;
		this.ID = null;
	}
	get name() {
		return this._name;
	}
	set name(name) {
		this._name = name;
	}
	set ID(ID) {
		this._ID = ID;
	}
	get ID() {
		return this._ID;
	}
}

var newCandidate = (name) => {
	var m_candidate = new Candidate(name);
	return m_candidate;
}

exports.createCandidate = function(name){
	var m_candidate = newCandidate(name);
	return m_candidate;
}

