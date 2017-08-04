const Voter = require('../models/voter');
const async = require('async');
const expressValidator = require('express-validator');

function postVoter(req, res) {
	let voter = new Voter();
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
	req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
	voter.name = req.body.name;
	voter.password = req.body.password;
	voter.isCandidate = false;

	Voter.findOne({ email: req.body.email }, (err, existingUser) => {
		if(err) res.send(err);
		if(existingUser) res.send('voter already exists');
		voter.save(function(err) {
			if(err) res.send(err);
			res.send(voter);
		});
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
	if(typeof req.params.name !== 'string'){
		res.send('name should be string');	
	} else {
	let query = Voter.findOne({ name: req.params.name });
	query.exec((err, voter) => {
		if(err) res.send(err);
			res.json(voter);
		});
	}
}
function inputForm(req, res) {
	res.render('voterSignUp');
}
function _getVoterByName(name){
	console.log("em _getVoterByName name eh: " + name);
		async.parallel(
		{
			voter: function(callback) {
				Voter.findOne({'name' : name }, function(err,voter) {
					callback(err, voter);
				});
			}
		},
		function(e, r) {
			if(r.voter === null) {
				return 'voter not found';
			} else { 
				return r.voter;
			}
		});
}
module.exports = { postVoter, getVoters, getVoterByName, _getVoterByName, turnVoterIntoCandidate, inputForm }