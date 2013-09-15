$(document).ready(function() {

	// do we already have their email
	if(localStorage.getObj("email") != null) {
		if(localStorage.getItem("reason") == "playAgain") {
			window.location = localStorage.getItem("collection");
		} else {
			window.location = "/likes";
		}
	}

	if(localStorage.getObj("likes") == null) {
		$("#before").text("You didn't like anything. Enter your email address and we'll show you better items next time.");
	}


	if(localStorage.getItem("reason") == "playAgain") {
		$("#before").text("Before you play again, who are you?");
	}



	$("#giveEmail").click(function(e) {
		e.preventDefault();
		var email = $("#InputEmail").val();
		if(validateEmail(email)) {
			localStorage.setItem("email", email);
			mixpanel.track('Given email',{}, function() {
				mixpanel.alias(email);
				mixpanel.identify(email);


				mixpanel.people.set({
					"$email": email,
					"Age" : localStorage.getItem("age"),
					"Gender" : localStorage.getItem("gender")
				}, function() {
					if(localStorage.getItem("reason") == "playAgain") {
						window.location = localStorage.getItem("collection");
					} else if(localStorage.getItem("reason") == "buy") {
						// open in new tab
						// redirect to their likes

						mixpanel.people.increment("Buy Count");

						mixpanel.track("Buy Item", {"url": href}, function() {
							open(localStorage.getItem("buy"), "_blank");
							window.location = "/likes";
						})

					}
				});

			});
		}

	});


});

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
