Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


$(document).ready(function() {

	$(".weaveButton").hover(function() {
		$(this).attr("src", "/images/weaveClick.png");
	}, function() {
		$(this).attr("src", "/images/weave.png")
	});

	if (!Modernizr.localstorage) {
		alert("NO LOCAL STORAGE");
	}

	var d = new Date(),
		dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

	var today = localStorage.getObj(dateString);
	if(today != null) { // we have been here before today
		if(today.length == 2) { // we have been through both tracks
			console.log('been before and seen 2 today')
			window.location = "/likes";
		} else {
			window.location = "/collection/" + localStorage.getItem("gender") + "/2";
		}
	} else if(localStorage.getItem("gender") != null) { // we have been here before, but not today 
		window.location = "/collection/" + localStorage.getItem("gender") + "/1";
	} // else we have not been on this site before


	var gender = "",
		age = "";
	
	// hide onboarding elements
	$(".onboarding").hide();

	// mouse click on Let's Go
	$("#step1, .iPhone, .caption ol").click(function(){
		$(".landing").hide();
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
		console.log(e)
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
				var d = new Date(),
				dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

				var today = localStorage.getObj(dateString);

			if(today == null) { // we have not been through one
				window.location = "/collection/" + gender + "/1"
				//localStorage.setObj(dateString, [true]);
			} else {
				window.location = "/collection/" + gender + "/2";
				//localStorage.setObj(dateString, [true, true]);
				}
			});
		};
	});
});
