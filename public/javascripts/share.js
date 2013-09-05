$(document).ready(function() {

	$("#share").click(function(e) {
		e.preventDefault();

		var friendNames = [$("#friendName1").val(), $("#friendName2").val(), $("#friendName3").val()],
			friendEmails = [$("#friendEmail1").val(), $("#friendEmail2").val(), $("#friendEmail3").val()];

		$.ajax({
		  type: "POST",
		  url: "/share",
		  data: {
		  	"emailAddresses": friendEmails,
		  	"names": friendNames
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
