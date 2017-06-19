let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let socketServer = require('./app/controllers/socketController');
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
	app.listen(port);
	console.log('listening on ' + port);
};

let initP2PServer = () => {
	socketServer.initP2PServer(initialPeers);
};

initHttpServer();
initP2PServer();
