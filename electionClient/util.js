var CryptoJS = require('crypto-js');
var Election = require('./election.js');

module.exports = exports = {};

exports.generatePublicID = function(name){ 
	return CryptoJS.SHA256(name).toString();
}

exports.votePrettyPrinter = function(m_election,vote) {
	//console.log(vote.getCandidateID);
	console.log("vote went for:");
	console.log("Candidate:" + m_election.getCandidateNameByID(vote.getCandidateID));
	console.log("Voter:" + m_election.getVoterNameByID(vote.getVoterID) + "\n");
}