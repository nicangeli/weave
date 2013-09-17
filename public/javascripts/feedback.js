$(document).ready(function() {

	var email = "";
	$("#email, .emailLabel").hide();
		

	$(".feedbackThanks").hide()
	if(localStorage.getItem("email") == null || localStorage.getItem("email") == "") {
		$("#email, .emailLabel").show();
		email = localStorage.getItem("email");
	}

	$("#feedbackButton").click(function(e) {
		e.preventDefault();
		var email = $("#email").val(),
			feedback = $("#feedback").val();

		localStorage.setItem("email", email);

		mixpanel.identify();
		mixpanel.people.set({"$email" : email})
		mixpanel.track("Feedback Sent");

		$("form, p, h1").hide();
		$(".feedbackThanks").show();

		$.ajax({
		  type: "POST",
		  url: "/feedback",
		  data: {
		  	"email": email + localStorage.getItem("email"),
		  	"feedback": feedback
		  },
		  success: function() {
		  	window.location = "/";
		  }
		});
	});


});
