var votechain = [];
let socket = io.connect('https://localhost:443', {secure: true});

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
    console.log(response.message); //should print 'you're connected'
    $('.navbar-brand').text(mElection);
    joinElection(mElection);
  });

  socket.on("connected to election", function(response) {
    console.log(response.message);
    $('.connected').text(response.message);
    socket.emit("getCurrentVotechain", { clientCurrentVotechain: votechain, clientElectionRequested: mElection });
  });

  socket.on("ServerSendsVotechainToClient", function(obj) {
    if(obj.currentVotechain !== null) {
        votechain = obj.currentVotechain;
    } else {
      console.log('currentVotechain object was null');
    }
  });

  socket.on("currentStateOfVotechainOnServer", function(obj) {
      votechain = obj.currentVotechain;
      for(vote in votechain) {
        $('.votechainLog').append("<tr><td>" + JSON.stringify(vote.candidate) + "</td><td>"
                              + JSON.stringify(vote.voter) + "</td></tr>");    
        }
  });

    /* inserting a vote into the votechain */
  socket.on("isVoteValid", function(obj) {
    /*TODO: implement proper vote validation */
    if(obj !== null){
      validVote = obj.voteToValidate;
      socket.emit("voteValidationStatus", {isVoteValid: true, validVote : validVote });
      //console.log("sent vote for validation");
    }
  });

  /* persisting a vote to the votechain */
  socket.on("persistVote", function(obj) {
    //console.log("persistVote" + obj.voteToPersist);
    let voteToPersistToVotechain = obj.voteToPersist;
    $('.votechainLog').append("<tr><td>" + JSON.stringify(Encrypt(obj.voteToPersist.candidate)) + "</td><td>"
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
  let joinElection = function joinElection(mElection){
      socket.emit('joinElection', { electionRequested: mElection});
  }
});
function castVote(candidate) {
  let voteToInsert = { "candidate": candidate, "voter": socket.id };
  socket.emit("validateVote", { voteToValidate: voteToInsert, electionToRetrieveVotechain: mElection });
  //console.log(voteToInsert);
}
function printVotechain() {
  console.log("Votechain on clientside: " + getVotechain());
}
function getVotechain(){
    return JSON.stringify(votechain);
}
function exportJSON(el) {
    if(isElectionActive(mElection)) {
      alert("This election is still ongoing. Please try again later");
    } else {
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(votechain));
      el.setAttribute("href", "data:"+data);
      el.setAttribute("download", "data.json");     
    }
}
function isElectionActive(election) {
  
  
}
/** credits for the functions below go to @RandyMohan on https://stackoverflow.com/questions/3486465/is-there-a-way-to-encrypt-in-jquery **/
function Encrypt(str) {
    if (!str) str = "";
    str = (str == "undefined" || str == "null") ? "" : str;
    try {
        var key = 146;
        var pos = 0;
        ostr = '';
        while (pos < str.length) {
            ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
            pos += 1;
        }

        return ostr;
    } catch (ex) {
        return '';
    }
}
// function Decrypt(str) {
//     if (!str) str = "";
//     str = (str == "undefined" || str == "null") ? "" : str;
//     try {
//         var key = 146;
//         var pos = 0;
//         ostr = '';
//         while (pos < str.length) {
//             ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
//             pos += 1;
//         }

//         return ostr;
//     } catch (ex) {
//         return '';
//     }
// }

