const Voter = require('../models/voter');
const async = require('async');
const expressValidator = require('express-validator');

function postVoter(req, res) {
	let voter = new Voter();
	_handleErrors(req,res,"postVoter");
	console.log("req.body.name " + req.body.name);
	console.log("req.body.password " + req.body.password );
	console.log("req.body.email " + req.body.email);
	voter.name = req.body.name;
	voter.password = req.body.password;
	voter.isCandidate = false;
	voter.email = req.body.email;

	Voter.findOne({ email: req.body.email }, (err, existingUser) => {
		if(err) res.send(err);
		if(existingUser) res.send('voter already exists');
		voter.save(function(err) {
			if(err) {
				console.log(err);
				res.send(err);
			} else { 
				console.log("voter.name " + voter.name);
				res.json({"name": voter.name});
			 }
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
function _handleErrors(req,res,originMethod) {
	if(originMethod === "postVoter") {
		if(!req.assert('email', 'Email is not valid').isEmail()) {
			res.json({"message" : "email not valid" });
		}
		if(!req.assert('password', 'password must be at least 4 characters long').len(4)) {
			res.json({'message': "password should be at least 4 characters long" });
		}
		if(!req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)) {
			res.json({"message": "passwords do not match"});
		}
		req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
	}
}
module.exports = { postVoter, getVoters, getVoterByName, _getVoterByName, turnVoterIntoCandidate, inputForm }