/* TODO
 debug funcao de search da linked list, detalhes no console.log
*/
let Election = require('../controllers/electionController');
let request  = require('request');
let async	   = require('async');
let port 		 =  3000 || process.env.PORT;
let ROOT_URL = 'http://localhost:' + port; 
const TreeMap = require('treemap-js');
let electionVotechainMap = new TreeMap();
let currentNumberOfConnectedClients = 0;
let currentNumberOfValidatedVotes = 0;
let HashTable = require('hashtable');
let voteCountElectionMap = new HashTable();
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
		console.log("number of connected clients " + currentNumberOfConnectedClients);

		socket.emit('connected', { message: "you're connected" });

		socket.on('joinElection', function(obj) {
			if(obj === null) { socket.emit('obj was null'); } 
			else {
				let requestURL = ROOT_URL + '/election/' + obj.electionRequested;

				/* checks if the election requested is already indexed by the application */
				if(!electionVotechainMap.get(obj.electionRequested)) {
					electionVotechainMap.set(obj.electionRequested, []);
				}

				request.get(requestURL, function(err, res, body) {
					if(!err && res.statusCode == 200 && res.body !== '[]'){
						async.parallel(
							{
								joinRoom: function(callback) {
									socket.join(obj.electionRequested, () => {
										let rooms = Object.keys(socket.rooms);
										callback(rooms);
									});
								}, function(e, r) {
									socket.emit("connected to election", { message: 'socket ' + socket.id + ' joined election ' + obj.electionRequested });
							}
						});						
					}
				});
			}
		});

		socket.on("getCurrentVotechain", function(obj){
			let electionRequested = obj.clientElectionRequested;
			let votechainReceived = obj.clientCurrentVotechain;
			let currentVotechainForGivenElection = getVotesForGivenElection(electionRequested);

			if(votechainReceived === currentVotechainForGivenElection) {
				socket.emit("VotechainUpToDate");
			}
			else {
				socket.emit("ServerSendsVotechainToClient", { currentVotechain: currentVotechainForGivenElection });
			}
		});


	  /**
	  * returns a candidate vote and queries all clients connected to an election to validate that vote
	  **/
	  socket.on("validateVote", function(obj){
	  	  let electionRequested = obj.electionToRetrieveVotechain;
	  	  let voteToValidate = obj.voteToValidate;
	  	  let electionExists = false;
	  	  Object.keys(socket.rooms).forEach(function(key) {
  			if(electionRequested === key) {
  				electionExists = true;
  				}
				});
	  	  if(electionExists) {
      		io.sockets.emit("isVoteValid", {voteToValidate: voteToValidate});
      		console.log(io.sockets.clients().length + "sockets connected");
      			}
			});

			//nodesThatNeedToValidateVote.setElection = electionRequested;
	  	// nodesThatNeedToValidateVote.insert(client);
		socket.on("voteValidationStatus", function(obj){
			if(obj.isVoteValid === true) {
					socket.emit("persistVote", {voteToPersist: obj.validVote });
				} else {
					socket.emit("Peer ID not found");
				}
		});

		socket.on("forceGetCurrentVotechain", function(obj){
			socket.emit("currentStateOfVotechainOnServer", {currentVotechain: currentVotechain });
		});	
	
		socket.on('disconnect', function(socket){
			console.log("socket " + socket.id + "disconnected\n");
			currentNumberOfConnectedClients--;
			console.log("number of connected clients: " + currentNumberOfConnectedClients);
		});
	});

	function getVotesForGivenElection(electionRequested) {
		return electionVotechainMap.get(electionRequested);
	}

	/**
	* updates the index of Election -> List of votes with the new vote
	* @params: electionRequested, voteToInsert
	*/

	function updateElectionVotechainMapNewVote(electionRequested, voteToInsert) {
		let currentVotesForElectionRequested = electionVotechainMap.get(electionRequested);
		let updatedVotes = currentVotesForElectionRequested.push(voteToInsert);
		electionVotechainMap.remove(electionRequested);
		electionVotechainMap.set(electionRequested, updatedVotes);
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

