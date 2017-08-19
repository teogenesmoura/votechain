const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const path = require('path');
const port = process.env.PORT || 443;
const httpsOptions = {
	key: fs.readFileSync('./file.pem'),
	cert: fs.readFileSync('./file.crt')
};
const server = https.createServer(httpsOptions, app);
const io = require('socket.io')(server);
const modularIo = require('./client/io.js')(io);
/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   
/* mongodb://vote:vote@ds133582.mlab.com:33582/vote */
/* mongodb://localhost:27017/vote */
let mongodbUri = 'mongodb://vote:vote@ds133582.mlab.com:33582/vote';
mongoose.connect(mongodbUri, options);
let conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:')); 
let initHttpServer = () => {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(express.static('public'));
	app.use(expressValidator());
	app.use(require('./routes'));
	app.set('views', path.join(__dirname, './client'));
	app.set('view engine', 'ejs');
	app.get('/', (req,res) => { res.render('index'); });
	server.listen(port, function() {
		console.log('express listening on port' + port);
	});
	return app;
}
conn.once('open', function() {
	initHttpServer();
});
module.exports = initHttpServer;
