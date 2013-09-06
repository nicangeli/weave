$(document).ready(function() {

	if(localStorage.getItem("gender") != null && localStorage.getItem("age") != null) {
		// we have been through onboarding before, send to collection
		window.location = "/likes"
	}

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
		$("#Play").show();
		$("#explanation").show();
	});

	//mouse click on Play
	$("#Play").click(function(e) {
		e.preventDefault();
		$.ajax({
		  type: "POST",
		  url: "/onboarding",
		  data: {
		  	"gender": gender,
		  	"age": age
		  },
		  success: function() {
		  	window.location = "/collection/1"
		  }
		});
	});

	/*//mouse click on email address go button
	$("#emailButton").click(function(e) {
		e.preventDefault();
		email = $("#inputEmail").val();
		localStorage.setItem("email", email);
		$.ajax({
		  type: "POST",
		  url: "/onboarding",
		  data: {
		  	"gender": gender,
		  	"age": age,
		  	"email": email
		  },
		  success: function() {
		  	window.location = "/collection/1"
		  }
		});

	});*/

});