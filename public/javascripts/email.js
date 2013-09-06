$(document).ready(function() {

	var email = "";

	$("#showHanger").click(function(e) {
		e.preventDefault();

		$("#showHanger").click(function(e) {
		e.preventDefault();
		email = $("#InputEmail").val();
		localStorage.setItem("email", email);
		$.ajax({
		  type: "POST",
		  url: "/email",
		  data: {
		  	"email": email,
		  },
		  success: function() {
		  	window.location = "/likes";
		  }
		});
	});
});
