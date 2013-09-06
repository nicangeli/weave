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
			var img = "<img src=" + likes[i].imageUrl + " class='likeImage'>",
				header = "<h2 class='shop'>" + likes[i].shop + "</h2>",
				price = "<h4>" + likes[i].price + "</h4>",
				brand ="<span class='tagline'> - " + likes[i].brand + " - </span>",
				anchor = '<a target="_blank" href="' + likes[i].url + '">Buy Now</a>';

			if (likes[i].brand == likes[i].shop) {
				brand = "";
			};
			// grab the heading and start appending items after it
			var element = '<hr><div class="row"><div class="col-xs-3">' + img + '</div><div class="col-xs-6 info">' + header + brand + price + '</div><div class="col-xs-3"><button type="button" class="btn btn-default btn-lg buy">Buy</button></div></div>';
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
