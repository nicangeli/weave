Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	// get the localstorage likes
	var likes = localStorage.getObj("likes");
	if(likes == null || likes.length == 0) {
		$("#reveal").append("<p>Looks like you didn't like anything!</p>");
	} else {
		for(var i = 0; i < likes.length; i++) {
			var img = "<img src=" + likes[i].imageUrl + " class='likeImage'>",
				header = "<h2 class='shop'>" + likes[i].shop + "</h2>",
				price = "<h4>" + likes[i].price + "</h4>",
				brand ="<span class='tagline'> - " + likes[i].brand + " - </span>",
				anchor = '<a target="_blank" href="' + likes[i].url + '">Buy Now</a>';

			if (likes[i].brand == likes[i].shop) {
				brand = "";
			};
			// grab the heading and start appending items after it
			var element = '<div class="row"><div class="col-xs-3">' + img + '</div><div class="col-xs-6">' + header + brand + price + '</div><div class="col-xs-3"><span class="glyphicon glyphicon-icon-arrow-right"></span></div></div><hr>';
			$("#reveal").append(element);
		}
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
