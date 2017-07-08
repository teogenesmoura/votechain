let Election = require('../controllers/electionController');
let request  = require('request');
let async	   = require('async');
let port 		 =  3000 || process.env.PORT;
let ROOT_URL = 'http://localhost:' + port; 
let currentVotechain = [{"voterID": "595fe92cef29084d1cc8d6a2", "candidateID": 1}, {"voterID": "5955c91b8d8840b9049ab14d", "candidateID": 2}, {"voterID": "595a94e2dbd111fe1e8b4ac9", "candidateID":1}];
let currentVoteToValidate;
let currentNumberOfConnectedClients = 0;
let currentNumberOfValidatedVotes = 0;
let peersThatNeedToValidateVote;
/**
* Initiates a connection between the socket and the server.
* Current connection methods:
* io.on('connection');
*  @params: electionRequested
*  @returns: connects socket to election room or sends error message
*  socket.on('joinElection');
*/

/*
* Current protocol:
* Client connects -> Server emit 'connected'
* Client on 'join election' -> Server emits 'connected to election'
* Client on 'validateVote'  -> Server emits 'isVoteValid' OR 'Election does not exist'
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
				request.get(requestURL, function(err, res, body) {
					if(!err && res.statusCode == 200 && res.body !== '[]'){
						async.parallel(
							{
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
			}
		});

	  socket.on("validateVote", function(obj){
	  	  let electionRequested = obj.electionToRetrieveVotechain;
	  	  console.log(electionRequested);
	  	  console.log("Object keys em validate vote: \n");
	  	  console.log(Object.keys(socket.rooms));
	  	  if(electionRequested in Object.keys(socket.rooms)){
	  	  	console.log("entrou aqui");
	  	  }
	  		//console.log(io.sockets.sockets);
	  		//let roomCorrespondingToElectionRequested = io.sockets.adapter);
	  		//console.log(roomCorrespondingToElectionRequested);
	  		//let peersThatNeedToValidateVote = Object.keys(socket.rooms);
	  		//console.log(peersThatNeedToValidateVote);
	  		// for(peer in connectedPeers) {
	  		//  	socket.to(peer).emit("isVoteValid", {voteToValidate: currentVoteToValidate});
	  		// }
		});

		socket.on("getCurrentVotechain", function(obj){
			let votechainReceived = obj.clientCurrentVotechain;

			if(votechainReceived === currentVotechain) {
				socket.emit("VotechainUpToDate");
			}
			if(votechainReceived.length < currentVotechain.length) {	
				socket.emit("ServerSendsVotechainToClient", { currentVotechain: currentVotechain });
			}
			if(votechainReceived.length > currentVotechain.length) {
				socket.emit("VotechainReceivedLongerThanCurrentVotechain");
			}
		});

		socket.on("voteValidationStatus", function(obj){
			if(obj.isVoteValid === true) {
				console.log("socket that confirmed vote has id :" + socket.id + "\n");
				console.log("the list of peers that need to confirm vote is: " + peersThatNeedToValidateVote);
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
}






// io.on('connection', function(socket){
// 	socket.on('userAuth', function(obj) {
// 		let getURI = ROOT_URL + 'voter/' + obj.voter;
// 		request.get(getURI,	function(err, res, body) {
// 			if(!err && res.statusCode == 200 && res.body !== '[]') {
// 				socket.emit('authenticated', {message: 'user was authenticated'} );
// 			} else {
// 				socket.emit('unauthenticated', {message: 'user wasnt authenticated'} );
// 				}
// 			}
// 		);
// 	});
// 	socket.on('castVote', function(obj,callbackFn){
// 		console.log('chega aqui');
// 		request.post(
// 			ROOT_URL + 'election/castVote',
// 			{ json: { election: obj.election, candidate: obj.candidate, voter: obj.voter } },
// 			function(error, response, body) {
// 				if(!error && response.statusCode == 200) {
// 					let responseObj = JSON.stringify(response);
// 					socket.emit('vote was cast', {responseObj});
// 				}
// 			}
// 		);
// 	});
// });
