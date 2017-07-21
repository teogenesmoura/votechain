var votechain = [{ "voterID" : 1, "candidateID" : 1}];
let mElection = "BRGeneralElection";
let socket = io.connect('http://localhost:3000');
let voteToInsert = { "voterID": "595fe92cef29084d1cc8d6a2", "candidateID": "592fe72cef29084d1cc8d6a2" };

$(document).ready(function() { 
  /* functions available */
  //validateVote();
  //joinElection(mElection);

  /* connection establishment and votechain sync */
  socket.on("connected", function(response) {
    console.log(response.message);
    joinElection(mElection);
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
      validateVote();
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

  /* inserting a vote into the votechain */
  socket.on("isVoteValid", function(obj) {
    if(obj !== null){
      validVote = obj.voteToValidate;
      socket.emit("voteValidationStatus", {isVoteValid: true, validVote : validVote });
    }
  });
  /* persisting a vote to the votechain */
  socket.on("persistVote", function(obj) {
    let voteToPersistToVotechain = obj.voteToPersist;
    votechain.push(voteToPersistToVotechain);
  });

  });   
  let validateVote = function validateVote(){ 
      socket.emit("validateVote", { voteToValidate: voteToInsert, electionToRetrieveVotechain: mElection });
  }
  let joinElection = function joinElection(mElection){
      socket.emit('joinElection', { electionRequested: mElection});
  }
});

function getVotechain(){
    return JSON.stringify(votechain);
}