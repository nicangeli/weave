$(document).ready(function() {

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
		mixpanel.track('Twitter Share', {}, function() {
			open($(this).attr('href'));
			window.location = "/likes";
		});
	});

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
					window.location = "/likes";
				});

			});

			//;




			//window.location = "/likes";
		}

	});

	$("#skip").click(function(e) {
		e.preventDefault();
		mixpanel.track("Skip Share", {}, function() {
			window.location = "/likes";
		});
	})

});

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
