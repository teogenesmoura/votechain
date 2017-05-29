"use strict";

var exports = module.exports = {};
var CryptoJS = require("crypto-js");

class Vote {
    constructor(index, previousHash, timestamp, candidate, voterID, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.candidate = candidate;
        this.voterID = voterID;
        this.hash = hash.toString();
    }
}

class Votechain{
    constructor() {
        this.initialVote = new Vote(0, "0", 1465154705, "general candidate", "general voter", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
        this.votechain = [this.initialVote];
    }
    getLatestVote() {
        return this.votechain[this.votechain.length - 1];
    }
    isValidNewVote(newVote, previousVote)   {
        if (previousVote.index + 1 !== newVote.index) {
            console.log('invalid index');
            return false;
        } else if (previousVote.hash !== newVote.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (this.calculateHashForVote(newVote) !== newVote.hash) {
            console.log(typeof (newVote.hash) + ' ' + typeof this.calculateHashForVote(newVote));
            console.log('invalid hash: ' + this.calculateHashForVote(newVote) + ' ' + newVote.hash);
            return false;
        }
        return true;
    }
    addVote(newVote) {
        if (this.isValidNewVote(newVote, this.getLatestVote())) {
            this.votechain.push(newVote);
            return true;
        }
        return false;
    }
    generateNextVote(candidateID,voterID) {
        var previousVote = this.getLatestVote();
        var nextIndex = previousVote.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        var nextHash = this.calculateHash(nextIndex, previousVote.hash, nextTimestamp, candidateID, voterID);
        return new Vote(nextIndex, previousVote.hash, nextTimestamp, candidateID, voterID, nextHash);
    }
    calculateHashForVote(vote)  {
        return this.calculateHash(vote.index, vote.previousHash, vote.timestamp, vote.candidate, vote.voterID);
    }
    /*TODO: refactor calculateHash into a Util class*/
    calculateHash(index, previousHash, timestamp, candidate, voterID)   {
        return CryptoJS.SHA256(index + previousHash + timestamp + candidate + voterID).toString();
    }
    /* Entry point for external entities
       params: candidate and VoterID
       return: if sucessful returns last vote cast, else returns undefined */
    castNewVote(candidate,VoterID)  {
        var new_vote = this.generateNextVote(candidate.ID,VoterID);
        if (this.addVote(new_vote)) {
            return this.getLatestVote();
        } else {
            return undefined;
        }
    }
    get allVotes()  {
        return this.votechain;
    }
}

module.exports = Votechain;








