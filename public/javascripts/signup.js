$(document).ready(function() {
	
	// hide warning
	$(".signupError").hide();

	$("#peopleSignup").click(function(e) {
		e.preventDefault();
		if($("form")[0].checkValidity()) {
			console.log('tracked')
			mixpanel.identify();
			
			mixpanel.people.set({
				"$email" : $("#email").val(),
				"name" : $("#name").val()
			});

			mixpanel.track("Create Account", {
			}, function() {
				var data = {
					name: $("#name").val(),
					email: $("#email").val(),
					password: $("#password").val()
				}
				$.post("/signup", data)
					.done(function(data) {
						window.location = "/collections";
					})
					.fail(function() {
						alert("Oops... Something went wrong");
					});
				}
			);
		} else {
			$(".signupError").fadeIn("slow");
		}
	});


});