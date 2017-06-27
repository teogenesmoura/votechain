let app        = require('express')();
let http       = require('http').Server(app);
let io		   = require('socket.io')(http);          
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let request    = require('request');
let path 	   = require('path');
let port 	   = process.env.PORT || 3000; 
let ROOT_URL   = process.env.ROOT_URL || 'http://localhost:3000/';

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   

/* mongodb://vote:vote@ds133582.mlab.com:33582/vote */
/* mongodb://localhost:27017/vote */

let mongodbUri = 'mongodb://localhost:27017/vote';
mongoose.connect(mongodbUri, options);
let conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:'));  

let initHttpServer = () => {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(require('./routes'));
	app.get('/config.js', function(req,res) { res.write("var ROOT_URL='"+process.env.ROOT_URL+"'" + '\n'); res.end(); });
	http.listen(port, function() {
		console.log('express listening on port' + port);
		console.log('a user connected');
	});
	return app;
}

io.on('connection', function(socket){
	socket.on('userAuth', function(obj) {
		let getURI = ROOT_URL + 'voter/' + obj.voter;
		request.get(getURI,	function(err, res, body) {
			if(!err && res.statusCode == 200 && res.body !== '[]') {
				socket.emit('authenticated', {message: 'user was authenticated'} );
			} else {
				socket.emit('unauthenticated', {message: 'user wasnt authenticated'} );
				}
			}
		);
	});
	socket.on('castVote', function(obj,callbackFn){
		console.log('chega aqui');
		request.post(
			ROOT_URL + 'election/castVote',
			{ json: { election: obj.election, candidate: obj.candidate, voter: obj.voter } },
			function(error, response, body) {
				if(!error && response.statusCode == 200) {
					let responseObj = JSON.stringify(response);
					socket.emit('vote was cast', {responseObj});
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
module.exports = initHttpServer;
// initP2PServer();
