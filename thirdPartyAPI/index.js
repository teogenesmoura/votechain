let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/thirdParty/persistVote', function(req,res) {
	if(!req.body.vote) {
		res.send('vote invalid');
	} else {
		res.send('vote persisted sucessfully');
	}
});
app.listen(port, function() {
	console.log("listening on localhost:"+port);
})	