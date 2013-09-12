Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


$(document).ready(function() {

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
	$("#Questions").hide();
	$(".male").hide();
	$(".female").hide();
	$("#Play").hide();
	$(".age").hide();
	$("#maleButton").hide();
	$("#femaleButton").hide();

	// mouse click on Let's Go
	$("#LetsGo").click(function(){
		$(".Landing").hide();
		$("#Questions").show();
		$("#male, #female, #maleButton, #femaleButton").show();
		$(".age").show();
		$("#Play").show();
	});

	// mouse click on male or female button
	$("#male, #female").click(function() {
		gender = $(this).attr('id');
		localStorage.setItem("gender", gender);
		mixpanel.track("Gender", {
			"Sex": gender
		});
		if(gender == "male") {
			$("#male").attr("src", "/images/m-select.png")
			$("#female").attr("src", "/images/f.png")
		} else if(gender == "female") {
			$("#female").attr("src", "/images/f-select.png")
			$("#male").attr("src", "/images/m.png")
		}
	});

	$("#maleButton").click(function() {
		$("#male").trigger("click");
	});

	$("#femaleButton").click(function() {
		$("#female").trigger("click");
	});

	//mouse click on Play
	$("#Play").click(function(e) {
		e.preventDefault();
		if(localStorage.getItem("gender") == "male" || localStorage.getItem("gender") == "female") {
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
		}
	});

});
