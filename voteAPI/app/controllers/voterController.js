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

module.exports = { postVoter, getVoters, getVoterByName }