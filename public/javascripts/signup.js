$(document).ready(function() {

	$("#peopleSignup").click(function(e) {
		e.preventDefault();
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
				.fail(function() {
					alert("Oops... Something went wrong");
				});
			}
		);
	});


});