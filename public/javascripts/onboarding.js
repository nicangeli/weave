$(document).ready(function() {

	$(".weaveButton").hover(function() {
		$(this).attr("src", "/images/weaveClick.png");
	}, function() {
		$(this).attr("src", "/images/weave.png")
	});

	if (!Modernizr.localstorage) {
		alert("NO LOCAL STORAGE");
	}

	if(localStorage.getItem("gender") != null && localStorage.getItem("age") != null) { // we have been here before, but not today 
		window.location = "/collections";
	} // else we have not been on this site before


	var gender = "",
		age = "";
	
	// hide onboarding elements
	$(".onboarding").hide();

	// mouse click on Let's Go
	$("#step1, .iPhone").click(function(){
		mixpanel.track("Onboarding Start");
		$(".landingPage").hide();
		$(".onboarding").show();
	});

	// mouse click on male or female button -- Can probably refactor this. Let's get an intern to do it.
	$("#female").hover(function() {
		if(localStorage.getItem("gender") != "female") {
			$(this).attr("src", "/images/woman-hover.png");	
		}
	}, function() {
		if(localStorage.getItem("gender") != "female") {
			$(this).attr("src", "/images/woman.png");
		}
	});

	$("#male").hover(function() {
		if(localStorage.getItem("gender") != "male") {
			$(this).attr("src", "/images/man-hover.png");	
		}
	}, function() {
		if(localStorage.getItem("gender") != "male") {
			$(this).attr("src", "/images/man.png");
		}
	});

	$("#male, #female").click(function() {
		gender = $(this).attr('id');
		localStorage.setItem("gender", gender);
		/*mixpanel.track("Gender", {
			"Sex": gender
		});*/
		if(gender == "male") {
			$("#male").attr("src", "/images/man-selected.png")
			$("#female").attr("src", "/images/woman.png")
		} else if(gender == "female") {
			$("#female").attr("src", "/images/woman-selected.png")
			$("#male").attr("src", "/images/man.png")
		}
	});

	//mouse click on Play
	$("#step2").click(function(e) {
		e.preventDefault();

		if (localStorage.getItem("gender") == null) {
			alertify.alert("We need to know your gender");
		} else {
			age = $("select option:selected").val();
			gender = localStorage.getItem("gender");

			// Start tracking User
			mixpanel.identify();
			mixpanel.people.set({
				"Age" : age,
				"Gender" : gender
			});

			mixpanel.track("Onbaording Complete", {
				"Age" : age,
				"Gender" : gender
			}, function() {
				if(gender == "male") {
					alertify.alert("Currently Weave focuses on womans clothing. We'll be adding men shortly, please have a play.");
					window.location = "/collections";
				} else {
					window.location = "/collections";
				}
				
			});

			/*mixpanel.track("Gender", {
				"Age": age
			}); */
			
			localStorage.setItem("age", age);

			/*mixpanel.track("Play", {}, function() {
				window.location = "/collections";					
			});*/
		}
	});
});
