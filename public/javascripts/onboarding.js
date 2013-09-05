$(document).ready(function() {

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
		$("#male, #female").hide();
		$("#Gender").hide();
		$("#age").show();
		$("#age-group").show();
	});

	//mouse click on age
	$(".age").click(function() {
		age = $(this).text();
		$("#age").hide();
		$("#age-group").hide();
		$("#emailForm").show();
		$("#explanation").show();
	});

	//mouse click on email address go button
	$("#emailButton").click(function(e) {
		e.preventDefault();
		email = $("#inputEmail").val();
	
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

	});

});