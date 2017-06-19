let app        = require('express')();
let http       = require('http').Server(app);
let io		   = require('socket.io')(http);          
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let request    = require('request');
//let socketServer = require('./app/controllers/socketController');
let port = process.env.PORT || 3000; 
mongoose.connect('mongodb://localhost/vote');

var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
var sockets = [];
var MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};
let initHttpServer = () => {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(require('./app/routes'));
	http.listen(port, function() {
		console.log('express listening on port' + port);
		console.log('a user connected');
	});
};

io.on('connection', function(socket){
	socket.emit('initVotechainConnection', { voteChain: 'user required'});
	socket.on('userAuth', function(data) {
		console.log(data);
	});
	socket.on('castVote', function(election,candidate,voter) {
		request.post(
			'http://localhost:3000/election/castVote',
			{ json: { election: election, candidate: candidate, voter: voter } },
			function(error, response, body) {
				if(!error && response.statusCode == 200) {
					console.log(JSON.stringify(response));
					//socket.emit('vote was cast', {voteInformation: response});
				}
			}
		);
	});
});
// let initP2PServer = () => {
// 	socketServer.initP2PServer(initialPeers);
// };

initHttpServer();
// initP2PServer();
