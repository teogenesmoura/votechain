/* 
	Ideally we'd store the votechains in a database instance (Mongo, for example), but considering that each vote
	takes roughly 130 bytes of space, 1 GB of memory could store up to 7.69 million votes so introducing database
	storage would be more costly in terms of project complexity than it'd mean in terms of overall gain. 
	To put in perspective one could store Brazil's elections (~200 million votes) using 4 standard computers each 
	with 8gbs of RAM.
*/
let Election = require('../controllers/electionController');
let request = require('request');
let async = require('async');
let shortid = require('shortid');
let port =  3000 || process.env.PORT;
let ROOT_URL = 'http://localhost:' + port; 
const TreeMap = require('treemap-js');
let electionVotechainMap = new TreeMap();
let currentNumberOfConnectedClients = 0;
let currentNumberOfValidatedVotes = 0;
let HashTable = require('hashtable');
let previousVoteToElectionMap = new HashTable();
let thirdPartyAPIURL = process.env.thirdPartyAPI || 'http://localhost:5000/thirdParty/persistVote';
// var { linkedList } = require('./LinkedList');
// var nodesThatNeedToValidateVote = new linkedList();

/**
* Initiates a connection between the socket and the server.
* Current connection methods:
* io.on('connection');
*  @params: electionRequested
*  @returns: connects socket to election room or sends error message
*  socket.on('joinElection');
*  Current protocol:
*  Client connects -> Server emit 'connected'
*  Client on 'join election' -> Server emits 'connected to election'
*  Client on 'validateVote'  -> Server emits 'isVoteValid' OR 'Election does not exist'
*/
module.exports = function(io){
	io.on('connection', function(socket){ 
		currentNumberOfConnectedClients++;
		//console.log("number of connected clients " + currentNumberOfConnectedClients);
		socket.emit('connected', { message: "you're connected" });
		socket.on('joinElection', function(obj) {
			let electionExists = false;
			if(obj === null) { 
				socket.emit('obj was null');
		  }	else {
				let requestURL = ROOT_URL + '/election/' + obj.electionRequested;
				/* checks if the election requested is already indexed by the application */
				if(!electionVotechainMap.get(obj.electionRequested)) {
					electionVotechainMap.set(obj.electionRequested, []);
				}
				/* checks whether the election was created with the API */
				request.get(requestURL, function(err, res, body) {
					if(!err && res.statusCode == 200 && res.body !== '[]'){
						electionExists = !electionExists;
							}
						});						
				/* joins election's socket.io room  */
				async.parallel({
					joinRoom: function(callback) {
						socket.join(obj.electionRequested, () => {
							let rooms = Object.keys(socket.rooms);
							console.log(rooms);
							callback(rooms);
							});
					}, function(e, r) {
							socket.emit("connected to election", { message: 'socket ' + socket.id + ' joined election ' + obj.electionRequested });
						}
				});
			}
		});
		socket.on("getCurrentVotechain", function(obj){
			let electionRequested = obj.clientElectionRequested;
			let votechainReceived = obj.clientCurrentVotechain;
			let currentVotechainForGivenElection = getVotesForGivenElection(electionRequested);
			socket.emit("ServerSendsVotechainToClient", { currentVotechain: currentVotechainForGivenElection });
		});
	  /**
	  * returns a candidate vote and queries all clients connected to an election to validate that vote
	  **/
	  socket.on("validateVote", function(obj){
	  	  let electionRequested = obj.electionToRetrieveVotechain;
	  	  let voteToValidate = obj.voteToValidate;
	  	  voteToValidate.election = electionRequested;
	  	  Object.keys(socket.rooms).forEach(function(key) {
		 			if(electionRequested === key) {
	  				io.sockets.in(electionRequested).emit("isVoteValid", {voteToValidate: voteToValidate});
	  				return;
	  				}
				});
			});
		socket.on("voteValidationStatus", function(obj){
   		if(obj.isVoteValid) {
   				let vote = prepareVoteToBePersisted(obj.validVote);
   				persistVote3rdPartyAPI(vote);
					socket.emit("persistVote", {voteToPersist: vote });
				} else {
					socket.emit("Peer ID not found");
				}
		});
		socket.on('disconnect', function(socket){
			currentNumberOfConnectedClients--;
		});
	});
	function persistVote3rdPartyAPI(vote) {
		request.post(
    	thirdPartyAPIURL,
    	{ json: { 'vote' : vote } },
    	function (error, response, body) {
         console.log("persistVote3rdPartyAPI"+body);

        if (!error && response.statusCode == 200) {
        }
    }
	);
	}
	function prepareVoteToBePersisted(vote) {
		vote.id = shortid.generate();
		vote.previousVote = updatePreviousVoteReference(vote);
		return vote;
	}
	function updatePreviousVoteReference(vote) {
		let previousVote;
		if(!previousVoteToElectionMap.has(vote.election)) {
			previousVoteToElectionMap.put(vote.election, vote.id);
			previousVote = "Genesis Vote";
		} else {
			previousVote = previousVoteToElectionMap.get(vote.election);
			console.log("previousVote" + previousVote);
			previousVoteToElectionMap.remove(vote.election);
			previousVoteToElectionMap.put(vote.election, vote.id);
		}
		return previousVote;
	}
	function getVotesForGivenElection(electionRequested) {
		return electionVotechainMap.get(electionRequested);
	}
}

		// socket.on("voteValidationStatus", function(obj){
		// 	if(obj.isVoteValid === true) {
		// 		if(nodesThatNeedToValidateVote.search(socket.id)){
		// 			nodesThatNeedToValidateVote.remove(socket.id);
		// 			if(nodesThatNeedToValidateVote.getLength === 0) {
		// 				let electionRequested  = nodesThatNeedToValidateVote.getElection;
		// 				let connectedClients   = io.sockets.adapter.rooms[electionRequested].sockets;
		// 				for(client in connectedClients) {
		// 					updateElectionVotechainMapNewVote(electionRequested, obj.validVote);
		// 					console.log("Votes on the server side:" + getVotesForGivenElection(electionRequested));
		// 					io.to(client).emit("persistVote", {voteToPersist: obj.validVote });
		// 				}
		// 			}
		// 		} else {
		// 			socket.emit("Peer ID not found");
		// 		}
		// 	}
		// });

