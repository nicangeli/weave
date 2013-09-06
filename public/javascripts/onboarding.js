Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


$(document).ready(function() {

	if(localStorage.getItem("gender") != null && localStorage.getItem("age") != null) {
		// we have been through onboarding before, send to collection
		window.location = "/likes"
	}

	var gender = "",
		age = "",
		email = "";
	
	// hide onboarding elements
	$("#Gender").hide();
	$(".male").hide();
	$(".female").hide();
	$("#age-group").hide();
	$("#almost").hide();
	$("#emailForm").hide();
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
		localStorage.setItem("gender", gender);
		$("#male, #female").hide();
		$("#Gender").hide();
		$("#age").show();
		$("#age-group").show();
	});

	//mouse click on age
	$(".age").click(function() {
		age = $(this).text();
		localStorage.setItem("age", age);
		$("#age").hide();
		$("#age-group").hide();
		$("#emailForm").show();
		$("#explanation").show();
	});

	//mouse click on email address go button
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

	});

});