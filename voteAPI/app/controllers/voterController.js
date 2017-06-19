let Voter = require('../models/voter');

function postVoter(req, res) {
	let voter = new Voter();
	voter.name = req.body.name;
	voter.isCandidate = false;
	voter.save(function(err) {
		if(err) res.send(err);
		res.send(voter);
	});
}
function turnVoterIntoCandidate(req, res) {
	let query = Voter.find({ 'name' : req.body.name });
	query.exec((err, voter) => {
		if(voter.isCandidate) voter.isCandidate = false;
		if(!voter.isCandidate) voter.isCandidate = true;
		voter.save(function(err,voter) {
			if(err) res.send(err);
			res.json(voter);
		});
	});
}
function getVoters(req,res) {
	let query = Voter.find({});
	query.exec((err, voters) => {
		if(err) res.send(err);
		res.send(voters);
	});
}

function getVoterByName(req, res) {
	console.log(req.params.name);
	console.log(typeof req.params.name);
	if(typeof req.params.name !== 'string') res.send('name should be string');
	let query = Voter.find({ name: req.body.name });
	query.exec((err, voter) => {
		if(err) res.send(err);
		res.send(voter);
	})
}

function localGetVoterByName(name){
	let q = Voter.findOne({ 'name' : req.body.name });
	let voter = q.exec((err, voter) => {
		if(err) return (err);
		return (voter);
	});
}
module.exports = { postVoter, getVoters, getVoterByName, localGetVoterByName, turnVoterIntoCandidate }