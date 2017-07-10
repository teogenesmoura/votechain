let express    = require('express');
let app        = express();
let server     = require('http').Server(app);
let io         = require('socket.io')(server);    
let modularIo  = require('./client/io.js')(io);      
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let path 	   = require('path');
let port 	   = process.env.PORT || 3000; 
let ROOT_URL   = process.env.ROOT_URL || 'http://localhost:3000/';
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
let mongodbUri = 'mongodb://vote:vote@ds133582.mlab.com:33582/vote';
mongoose.connect(mongodbUri, options);
let conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:'));  
let initHttpServer = () => {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(express.static('public'));
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
// initP2PServer();
