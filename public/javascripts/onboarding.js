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


	//if(localStorage.getItem("gender") != null && localStorage.getItem("age") != null) {
		// we have been through onboarding before, send to collection
	//	window.location = "/likes"
	//}

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
	$("#Gender").hide();
	$(".male").hide();
	$(".female").hide();
	$("#age-group").hide();
	$("#almost").hide();
	$("#Play").hide();
	$("#explanation").hide();
	$("#age").hide();

	// mouse click on Let's Go
	$("#LetsGo").click(function(){
		$(".Landing").hide();
		$("#Gender").show();
		$("#male, #female").show();
	});

	// mouse click on male or female button
	$("#male, #female").click(function() {
		gender = $(this).attr('id');
		mixpanel.track("Gender", {
			"Sex": gender
		});
		localStorage.setItem("gender", gender);
		$("#male, #female").hide();
		$("#Gender").hide();
		$("#age").show();
		$("#age-group").show();
	});

	//mouse click on age
	$(".age").click(function() {
		age = $(this).text();
		mixpanel.track("Age", {
			"Age": age
		});
		localStorage.setItem("age", age);
		$("#age").hide();
		$("#age-group").hide();
		$("#Play").show();
		$("#explanation").show();
	});

	//mouse click on Play
	$("#Play").click(function(e) {
		console.log(e)
		e.preventDefault();
		mixpanel.track("Play");
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

	/*//mouse click on email address go button
	$("#emailButton").click(function(e) {
		e.preventDefault();
		email = $("#InputEmail").val();
		localStorage.setItem("email", email);
		var d = new Date(),
			dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

		var today = localStorage.getObj(dateString),
			location = "";

		if(today == null) { // we have not been through one
			location = "/collection/" + gender + "/1"
			localStorage.setObj(dateString, [true]);
		} else {
			location = "/collection/" + gender + "/2";
			localStorage.setObj(dateString, [true, true]);
		}
		$.ajax({
		  type: "POST",
		  url: "/onboarding",
		  data: {
		  	"gender": gender,
		  	"age": age,
		  	"email": email
		  },
		  success: function() {
		  	window.location = location;
		  }
		});

	});*/

});
