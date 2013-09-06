Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	$("#playAgain").hide();

	// get the localstorage likes
	var likes = localStorage.getObj("likes");
	if(likes == null || likes.length == 0) {
		$("#reveal").append("<p>Looks like you didn't like anything!</p>");
	} else {
		for(var i = 0; i < likes.length; i++) {
			var img = "<img src=" + likes[i].imageUrl + " style='width: 200px; height: 400px;'>",
				header = "<h2>" + likes[i].shop + "</h2>",
				paragraph = "<p>" + likes[i].price + "</p>",
				brand ="<p>" + likes[i].brand + "</p>",
				anchor = '<a target="_blank" href="' + likes[i].url + '">Buy Now</a>';

			// grab the heading and start appending items after it
			var element = '<div class="row"><div class="col-md-4">' + img + '</div><div class="col-md-8">' + header + paragraph + anchor + '</div></div><hr>';
			$("#reveal").append(element);
		}
	}

	var d = new Date(),
		dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

	var today = localStorage.getObj(dateString),
		location = "";

	if(today[1] == undefined) { // not been through 
		$("#playAgain").show();
	}


	$("#playAgain").click(function(e) {
		e.preventDefault();
		today[1] = true;
		localStorage.setObj(dateString, today);
		window.location = "/collection/" + localStorage.getItem("gender") + "/2"
	});

	$("#feedback").click(function(e) {
		e.preventDefault();
		window.location = "/feedback";
	})


});
