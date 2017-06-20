let app        = require('express')();
let http       = require('http').Server(app);
let io		   = require('socket.io')(http);          
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let request    = require('request');
//let socketServer = require('./app/controllers/socketController');
let port = process.env.PORT || 3000; 
let rootURL = process.env.ROOT_URL || 'http://localhost:3000';
/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   

/* mongodb://vote:vote@ds133582.mlab.com:33582/vote */
let mongodbUri = 'mongodb://localhost:27017/vote';
mongoose.connect(mongodbUri, options);
let conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:'));  

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
	socket.on('castVote', function(obj) {
		request.post(
			'http://localhost:3000/election/castVote',
			{ json: { election: obj.election, candidate: obj.candidate, voter: obj.voter } },
			function(error, response, body) {
				if(!error && response.statusCode == 200) {
					socket.emit('vote was cast', {voteInformation: response});
				}
			}
		);
	});
});
// let initP2PServer = () => {
// 	socketServer.initP2PServer(initialPeers);
// };
conn.once('open', function() {
	initHttpServer();
});
// initP2PServer();
