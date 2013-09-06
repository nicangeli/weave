$(document).ready(function() {

	var email = "";
	$("#tweet").hide();
	$("#multi").hide();
	$("#skip").hide();
	// do we already have there email address?
	if(localStorage.getItem("email") != null) {
		//window.location = "/likes";
		//lets show the 
		$("form, h4").hide();
		$("#tweet, #multi, #skip").show();
	}

	$("#tweet").click(function(e) {
		e.preventDefault();
		open($(this).attr('href'));
	});

	$("#showHanger").click(function(e) {
		e.preventDefault();
		email = $("#InputEmail").val();
		localStorage.setItem("email", email);
		window.location = "/likes";
	});

	$("#skip").click(function(e) {
		e.preventDefault();
		window.location = "/likes";
	})

});
