Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	// get the localstorage likes
	var likes = localStorage.getObj("likes");
	for(var i = 0; i < likes.length; i++) {
		var img = "<img src=" + likes[i].imageUrl + ">",
			header = "<h2>" + likes[i].shop + "</h2>",
			paragraph = "<p>" + likes[i].price + "</h2>",
			anchor = '<a href="' + likes[i].url + '">Buy Now</a>';

		// grab the heading and start appending items after it
		$("#reveal").append(img + header + paragraph + anchor);
	}

	$("#playAgain").click(function(e) {
		e.preventDefault();
		window.location = "/collection/2"
	});

	$("#feedback").click(function(e) {
		e.preventDefault();
		window.location = "/feedback";
	})


});
