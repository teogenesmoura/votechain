<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<script src="https://cdn.jsdelivr.net/async/2.4.0/async.js"></script>

<script>
  let votechain = [{ "voterID" : 1, "candidateID" : 1}];
  let mElection = "BRGeneralElection";
  let socket = io.connect('http://localhost:3000');
  let voteToInsert = {"voterID": "595fe92cef29084d1cc8d6a2", "candidateID": 1};
  /* connection establishment and votechain sync */
  socket.on("connected", function(response) {
    console.log(response.message);
    socket.emit('joinElection', { electionRequested: mElection});
  });

  socket.on("connected to election", function(response) {
    console.log(response.message);
    socket.emit("getCurrentVotechain", { clientCurrentVotechain: votechain });
  });

  socket.on("VotechainUpToDate", function(obj) {
    console.log("local votechain is up to date");
  });

  socket.on("ServerSendsVotechainToClient", function(obj) {
    console.log("current state of local votechain is: " + JSON.stringify(votechain));
    if(obj.currentVotechain !== null) {
      votechain = obj.currentVotechain;
      console.log("updated votechain is: " + JSON.stringify(votechain));
    } else {
      console.log('currentVotechain object was null');
    }
  });

  socket.on("VotechainReceivedLongerThanCurrentVotechain", function(obj) {
    socket.emit("forceGetCurrentVotechain");
  });

  socket.on("currentStateOfVotechainOnServer", function(obj) {
    if(obj === null){
      socket.emit("forceGetCurrentVotechain");
    } else {
      votechain = obj.currentVotechain;
    }
  });

  /*ERROR MESSAGES*/

  socket.on("disconnect", function() {
    console.log("disconnect");
  });

  socket.on("connect_failed", function() {
    console.log("connection failed");
  });

  socket.on("election was not found", function(obj) {
    console.log('election was not found');
  });   
</script>