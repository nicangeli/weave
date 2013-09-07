$(document).ready(function() {

	var email = "";
	$("#tweet").hide();
	$("#multi").hide();
	$("#skip").hide();
	// do we already have there email address?
	if(localStorage.getItem("email") != null) {
		//window.location = "/likes";
		//lets show the 
		$("form, h4, #showHanger").hide();
		$("#tweet, #multi, #skip").show();
	}

	$("#tweet").click(function(e) {
		e.preventDefault();
		mixpanel.track('Twitter Share');
		open($(this).attr('href'));
		window.location = "/likes";
	});

	$("#showHanger").click(function(e) {
		e.preventDefault();
		email = $("#InputEmail").val();
		console.log(email);

		mixpanel.track("Give Email");

		mixpanel.alias(email);

		mixpanel.identify(email);

		mixpanel.people.set({
			"$email": email,
			"Age" : localStorage.getItem("age"),
			"Gender" : localStorage.getItem("gender")
		});

		if(validateEmail(email)) {
			localStorage.setItem("email", email);
			window.location = "/likes";
		}

	});

	$("#skip").click(function(e) {
		e.preventDefault();
		mixpanel.track("Ship Share");
		window.location = "/likes";
	})

});

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
