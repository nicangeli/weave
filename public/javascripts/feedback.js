$(document).ready(function() {

	$("#thanks").hide()

	$("#feedbackButton").click(function(e) {
		e.preventDefault();
		var email = $("#email").val(),
			feedback = $("#feedback").val();

		$("form, p, h1").hide();
		$("#thanks").show();

		$.ajax({
		  type: "POST",
		  url: "/feedback",
		  data: {
		  	"email": email,
		  	"feedback": feedback
		  },
		  success: function() {
		  	window.location = "/";
		  }
		});
	});


});
