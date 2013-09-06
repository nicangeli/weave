$(document).ready(function() {

	var email = "";
	// do we already have there email address?
	if(localStorage.getItem("email") != null) {
		window.location = "/likes";
	}

	$("#showHanger").click(function(e) {
		e.preventDefault();
		email = $("#InputEmail").val();
		localStorage.setItem("email", email);
		window.location = "/likes";
	});

});
