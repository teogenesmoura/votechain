$(document).ready(function() {
	  console.log("carrega APIcommunication.js");

  	$('#register-btn').click(function() {
  		let name = $('#name').val();
  		let email = $('#email').val();
  		let password = $('#password').val();
  
  	  	event.preventDefault();
	  	console.log("chega aqui");
	  	
	  	let url = '/voter';

	  	let postRequest = $.post( url, { name: name, email: email, password: password });
	  	//response object not to be mistaken with res from Express
	  	postRequest.done(function(response) {
	  		console.log(response);
	  	});
	  });
});