var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var WebSocket  = require('ws');
var port = process.env.PORT || 3000; 
var p2p_port = process.env.P2P_PORT || 6001;
mongoose.connect('mongodb://localhost/vote');

var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
var sockets = [];
var MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./app/routes'));

app.listen(port);
console.log('listening on ' + port);