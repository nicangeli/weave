$(document).ready(function() {

	$("#thanks").hide();

	$("#share").click(function(e) {
		e.preventDefault();
		$("form, h1, p").hide();
		$("#thanks").show();

		var friendEmails = [$("#friend1").val(), $("#friend2").val(), $("#friend3").val()];

		$.ajax({
		  type: "POST",
		  url: "/share",
		  data: {
		  	"emailAddresses": friendEmails,
		  },
		  success: function() {
		  	window.location = "/likes";
		  }
		});
	});

	$("#skip").click(function(e) {
		e.preventDefault();
		console.log('hey')
		window.location = "/likes";
	})


});
