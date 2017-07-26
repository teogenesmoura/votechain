var votechain = [];
let socket = io.connect('http://localhost:3000');

$(document).ready(function() { 

  $('#voting-btn').click(function() {
      console.log($('#candidateToVoteFor').val());
      castVote(($('#candidateToVoteFor').val()));
    });
  /* functions available */
  //validateVote();
  //joinElection(mElection);

  /* connection establishment and votechain sync */
  socket.on("connected", function(response) {
    console.log(response.message);
    console.log("currentVotechain: " + votechain);
    $('.navbar-brand').text(mElection);
    joinElection(mElection);
  });

  socket.on("connected to election", function(response) {
    console.log(response.message);
    $('.connected').text(response.message);
    socket.emit("getCurrentVotechain", { clientCurrentVotechain: votechain, clientElectionRequested: mElection });
  });

  socket.on("VotechainUpToDate", function(obj) {
    console.log("VotechainUpToDate");
  });

  socket.on("ServerSendsVotechainToClient", function(obj) {
    if(obj.currentVotechain !== null) {
        votechain = obj.currentVotechain;
    } else {
      console.log('currentVotechain object was null');
    }
  });

  socket.on("currentStateOfVotechainOnServer", function(obj) {
    if(obj === null){
      socket.emit("forceGetCurrentVotechain");
    } else {
      votechain = obj.currentVotechain;
      for(vote in votechain) {
        $('.votechainLog').append("<tr><td>" + JSON.stringify(vote.candidate) + "</td><td>"
                              + JSON.stringify(vote.voter) + "</td></tr>");    
        }
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
    $('.votechainLog').append("<tr><td>" + JSON.stringify(obj.voteToPersist.candidate) + "</td><td>"
                              + JSON.stringify(obj.voteToPersist.voter) + "</td></tr>");
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

  });   
  // let castVote = function castVote(vote){ 
  //   socket.emit("validateVote", { voteToValidate: voteToInsert, electionToRetrieveVotechain: mElection });
  // }
  let joinElection = function joinElection(mElection){
      socket.emit('joinElection', { electionRequested: mElection});
  }
});
function castVote(candidate) {
  let voteToInsert = { "candidate": candidate, "voter": socket.id };
  socket.emit("validateVote", { voteToValidate: voteToInsert, electionToRetrieveVotechain: mElection });
  console.log(voteToInsert);
}
function printVotechain() {
  console.log("Votechain on clientside: " + getVotechain());
}
function getVotechain(){
    return JSON.stringify(votechain);
}
function exportJSON(el) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(votechain));
    el.setAttribute("href", "data:"+data);
    el.setAttribute("download", "data.json");
}
