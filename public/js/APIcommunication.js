/* 
* TODO: extract POST request functionality into separate method 
*/
$(document).ready(function() {
  	$('#register-btn').click(function() {
  		let name = $('#name').val();
  		let email = $('#email').val();
  		let password = $('#password').val();
  	  event.preventDefault();
	  	let url = '/voter';
	  	let postRequest = $.post( url, { name: name, email: email, password: password });
	  	//response object not to be mistaken with res from Express
	  	postRequest.done(function(response) {
	  		console.log(response);
	  	});
	  });
});

let postCandidates = function postCandidates(candidates, electionName) {
	let url = '/election';
	let postRequest = $.post( url, {candidates: candidates, electionName: electionName });
	postRequest.done(function(response) {
  	console.log(response);
	});
}