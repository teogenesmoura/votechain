var Election = require('../controllers/electionController');
var request  = require('request');
let port 		 =  3000 || process.env.PORT;
var ROOT_URL = 'http://localhost:' + port; 

/**
* Initiates a connection between the socket and the server.
* Current connection methods:
* io.on('connection');
*  @params: electionRequested
*  @returns: connects socket to election room or sends error message
*  socket.on('joinElection');
*/
module.exports = function(server){
	var io 			 = require('socket.io')(server);
	console.log('entra aqui server');
	server.on('connect', function(socket){ 
		socket.emit('connected', { message: "you're connected" });
		socket.on('joinElection', function(obj) {
			if(obj === null) { socket.emit('obj was null'); } 
			else {
				let requestURL = ROOT_URL + '/election/' + obj.electionRequested;
				request.get(requestURL, function(err, res, body) {
					if(!err && res.statusCode == 200 && res.body !== '[]'){
							/* joins the channel of a specific election */
							socket.join(obj.electionRequested, (err) => {
						 	if(err){
						 		console.log(err);
						 	} else {
								let number_of_peers_in_election = io.of(obj.electionRequested).clients((error,clients) => {
									if(error) throw error;
									console.log(clients.length);
									return clients.length;
								});
								socket.emit('connected to election', { message: 'socket' + socket.id + 'joined election' + obj.electionRequested, number_of_peers_in_election });
							}
						});
					} else {
						socket.emit('not connected to election', { message: "it wasn't possible to connect to the election given" });
					}
				});
			}
		});    
    socket.on('retrieveVotechain', function(obj) {
    	
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
