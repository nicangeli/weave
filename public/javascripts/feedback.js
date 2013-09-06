Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	var email = "";
	$("#email, .emailLabel").hide();
		

	$("#thanks").hide()
	if(localStorage.getItem("email") == null || localStorage.getItem("email") == "") {
		$("#email, .emailLabel").show();
		email = localStorage.getItem("email");
	}

	$("#feedbackButton").click(function(e) {
		e.preventDefault();
		var email = $("#email").val(),
			feedback = $("#feedback").val();

		$("form, p, h1").hide();
		$("#thanks").show();

		$.ajax({
		  type: "POST",
		  url: "/feedback",
		  data: {
		  	"email": email,
		  	"feedback": feedback
		  },
		  success: function() {
		  	window.location = "/";
		  }
		});
	});


});
