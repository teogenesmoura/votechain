"use strict";
var exports = module.exports = {};
var u = require("./util.js");

var Candidate = class Candidate{
	constructor(name){
		this.name = name;
		this.ID = u.generate_publicID(name);
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

module.exports = Candidate;

