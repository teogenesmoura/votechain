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
	  		console.log(response.name);
	  		console.log(name);
	  		if(response.name === name) {
	  			$('.responseStatusMessage').append("<p> User sucessfully created! <a href='/election/create'> Create new election </a> ");
	  		} else {
	  			$('.responseStatusMessage').append("<p> User not created sucessfully :( </p> ");
	  		}
	  	});
	  });
});

