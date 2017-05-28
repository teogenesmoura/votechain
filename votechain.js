"use strict";

var exports = module.exports = {};
var votechain;

var Vote = class Vote {
    constructor(index, previousHash, timestamp, candidate, voterID, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.candidate = candidate;
        this.voterID = voterID;
        this.hash = hash.toString();
    }
}

var getGenesisBlock = () => {
    return new Vote(0, "0", 1465154705, "general candidate", "general voter", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

exports.createVotechain = () => {
	var votechain = [getGenesisBlock()];
	return votechain;
}