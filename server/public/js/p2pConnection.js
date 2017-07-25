var votechain = [];
let socket = io.connect('http://localhost:3000');
let voteToInsert = { "candidate": "595fe92cef29084d1cc8d6a2", "voter": "592fe72cef29084d1cc8d6a2" };

$(document).ready(function() { 
  /* functions available */
  //validateVote();
  //joinElection(mElection);

  /* connection establishment and votechain sync */
  socket.on("connected", function(response) {
    console.log(response.message);
    console.log("currentVotechain: " + votechain);
    $('.connected').text(response.message);
    $('.electionName').text(mElection);
    joinElection(mElection);
  });

  socket.on("connected to election", function(response) {
    console.log(response.message);
    $('.connected').text(response.message);
    socket.emit("getCurrentVotechain", { clientCurrentVotechain: votechain, clientElectionRequested: mElection });
  });

  socket.on("VotechainUpToDate", function(obj) {
    console.log("VotechainUpToDate");
    $('.votechainUpToDate').text("local votechain is up to date");
    validateVote();
  });

  socket.on("ServerSendsVotechainToClient", function(obj) {
    if(obj.currentVotechain !== null) {
        votechain = obj.currentVotechain;
          $('.votechainReceived').text(JSON.stringify(votechain));
          validateVote();
    } else {
      console.log('currentVotechain object was null');
    }
  });

  socket.on("currentStateOfVotechainOnServer", function(obj) {
    if(obj === null){
      socket.emit("forceGetCurrentVotechain");
    } else {
      votechain = obj.currentVotechain;
      $('.currentVotechain').text(JSON.stringify(votechain));
    }
  });

    /* inserting a vote into the votechain */
  socket.on("isVoteValid", function(obj) {
    /*TODO: implement proper vote validation */
    if(obj !== null){
      validVote = obj.voteToValidate;
      socket.emit("voteValidationStatus", {isVoteValid: true, validVote : validVote });
      console.log("sent vote for validation");
    }
  });

  /* persisting a vote to the votechain */
  socket.on("persistVote", function(obj) {
    console.log("persistVote" + obj.voteToPersist);
    let voteToPersistToVotechain = obj.voteToPersist;
    votechain.push(voteToPersistToVotechain);
    printVotechain();
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

  socket.on("teste", function(obj) {
    console.log("teste");
  });

  });   
  let validateVote = function validateVote(){ 
    socket.emit("validateVote", { voteToValidate: voteToInsert, electionToRetrieveVotechain: mElection });
  }
  let joinElection = function joinElection(mElection){
      socket.emit('joinElection', { electionRequested: mElection});
  }
});
function printVotechain() {
  console.log("Votechain on clientside: " + getVotechain());
}
function getVotechain(){
    return JSON.stringify(votechain);
}