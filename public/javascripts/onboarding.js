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
		$(".landingPage").hide();
		$(".onboarding").show();
	});

	// mouse click on male or female button -- Can probably refactor this. Let's get an intern to do it.
	$("#female").hover(function() {
		$(this).attr("src", "/images/woman.png")
	}, function() {
		if(localStorage.getItem("gender") != "female") {
			$(this).attr("src", "/images/womanSymbol.png")
		}
	});

	$("#male").hover(function() {
		$(this).attr("src", "/images/man.png")
	}, function() {
		if(localStorage.getItem("gender") != "male") {
			$(this).attr("src", "/images/manSymbol.png")
		}
	});

	$("#male, #female").click(function() {
		gender = $(this).attr('id');
		localStorage.setItem("gender", gender);
		mixpanel.track("Gender", {
			"Sex": gender
		});
		if(gender == "male") {
			$("#male").attr("src", "/images/man.png")
			$("#female").attr("src", "/images/womanSymbol.png")
		} else if(gender == "female") {
			$("#female").attr("src", "/images/woman.png")
			$("#male").attr("src", "/images/manSymbol.png")
		}
	});

	$("#maleButton").click(function() {
		$("#male").trigger("click");
	});

	$("#femaleButton").click(function() {
		$("#female").trigger("click");
	});

	//mouse click on Play
	$("#step2").click(function(e) {
		e.preventDefault();
		if (localStorage.getItem("gender") == null) {
			alertify.alert("We need to know your gender");
		} else {
			age = $("select option:selected").val();
			mixpanel.track("Age", {
				"Age": age
			}); 
			
			localStorage.setItem("age", age);

			mixpanel.track("Play", {}, function() {
				window.location = "/collections";					
			});
		}
	});
});
