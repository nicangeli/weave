Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	$("#playAgain").hide();
	$("#more").hide();
	$("#or").hide();


	// get the localstorage likes
	var likes = localStorage.getObj("likes");
	likes.reverse();

	var d = new Date(),
		dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

	var today = localStorage.getObj(dateString);
	if(today != null && today.length == 2) {
		$("#my").append("<p>Thanks for playing. Come back tomorrow for more collections.</p>");
	}

	if(likes == null || likes.length == 0) {
		$("#reveal").append("<p>Looks like you didn't like anything!</p>");
	} else {
		for(var i = 0; i < likes.length; i++) {
			var img = "<img src=" + likes[i].imageUrl + " class='likeImage'>",
				header = "<h2 class='shop'>" + likes[i].shop + "</h2>",
				price = "<h4>" + likes[i].price + "</h4>",
				brand ="<span class='tagline'> - " + likes[i].brand + " - </span>",
				anchor =  likes[i].url,
				deleteButton = '<button data-url="' + likes[i].imageUrl + '" type="button" class="btn btn-danger delete">Remove</button>';

			if (likes[i].brand == likes[i].shop) {
				brand = "<span class='tagline'></span>";
			};
			// grab the heading and start appending items after it
			var element = '<div class="row"><hr><div class="col-xs-3">' + img + '</div><div class="col-xs-6 info">' + header + brand + price + '</div><div class="col-xs-3"><a type="button" class="btn btn-default buy" target="_blank" href="' + anchor + '">Buy</a>' + deleteButton + '</div></div>';
			$("#reveal").append(element);
		}
	}

	var d = new Date(),
		dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

	var today = localStorage.getObj(dateString),
		location = "";

	if(today[1] == undefined) { // not been through 
		$("#playAgain").show();
		$("#more").show();
		$("#or").show();
	}


	$("#playAgain").click(function(e) {
		e.preventDefault();
		if(localStorage.getItem("email" != null)) { // we have already got their email
			mixpanel.track("Play Again", {}, function() {
				window.location = "/collection/" + localStorage.getItem("gender") + "/2";
			});
		} else {
			localStorage.setItem("reason", "playAgain");
			localStorage.setItem("collection", "/collection/" + localStorage.getItem("gender") + "/2")
			window.location = "/email";
		}
	});

	$("#feedback").click(function(e) {
		e.preventDefault();

		mixpanel.track("Feedback Click", {}, function() {
			window.location = "/feedback";
		});
	})

	$(".delete").click(function(e) {
		e.preventDefault();
		// find the element in the likes array
		// remove it
		// resave the likes array
		// reset likes to be the new array
		for(var i = 0; i < likes.length; i++) {
			var element = likes[i];
			if(element.imageUrl == $(this).attr('data-url')) {
				likes.splice(i, 1); // remove element from likes array
				localStorage.setObj("likes", likes);
				likes = localStorage.getObj("likes");
				$(this).parent().parent().fadeOut("slow", function() {
					$(this).remove();
				});
				break;
			}
		}
		mixpanel.track("Delete Product");
	});

	$(".buy").click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		if(localStorage.getItem("email") != null) {
			mixpanel.people.increment("Buy Count");

			mixpanel.track("Buy Item", {"url": href}, function() {
				window.location = href;
			})
		} else {
			localStorage.setItem("reason", "buy");
			localStorage.setItem("buy", href);
			window.location = "/email";
		}
	});


});
