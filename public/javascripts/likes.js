$(document).ready(function() {

	$("#more").hide();
	$("#or").hide();


	// get the localstorage likes
	var likes = localStorage.getObj("likes");
	if(likes != null) {
		likes.reverse();
	}

	if(likes == null || likes.length == 0) {
		$(".reveal").append("<p>Looks like you didn't like anything!</p>");
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
			$(".reveal").append(element);
		}
	}

	$("#playAgain").click(function(e) {
		e.preventDefault();
		mixpanel.track("Play Again", {}, function() {
			window.location = "/collections/";
		});
	});

	$("#nameCollection").click(function(e){
		e.preventDefault();
		if($("form")[0].checkValidity()) {
			e.preventDefault();
			var collectionName = $("#collectionName").val(),
				ownerName = $("#ownerName").val(),
				email = $("#ownerEmail").val();

			localStorage.setItem("email", email);

			var data = {
				"data": {
					"ownerEmail": localStorage.getItem("email"),
					"ownerName": ownerName,
					"ownerGender": localStorage.getItem("gender"),
					"ownerAge": localStorage.getItem("age"),
					"collectionName": collectionName,
					"products": localStorage.getObj("likes")
				}
			};

			mixpanel.identify();
			mixpanel.people.set({"$email" : email});
			mixpanel.people.increment("Share Count");

			mixpanel.track("Collection Share");
			
			$.post("/share", data)
				.done(function(data) {
	  				$(".modal-title").text("Share your first Collection");
					$(".modal-body-content").html("<p> Share the link below with your friends. They will be able to review your collection. We'll let you know the items they liked and disliked</p> <p class='shareLink'>" + data + "</p>");
					$(".shareButtons").show();
					$("#emailShare").html("<a class='btn btn-primary btn-xs emailShare' href='mailto:?Subject=I%20want%20your%20opinion%20&body=Hey%20I%20created%20a%20collection%20on%20Weave%2C%20take%20a%20look%20and%20tell%20me%20what%20you%20think%20-%20" + data + "' target='_top'> Email the link</a>");

					//clone twitter button
					var clone = $('.twitter-share-weave').clone()

					//fix up clone
					clone.removeAttr("style"); // unhide the clone
					clone.attr("data-url", data); 
					clone.attr("class", "twitter-share-button"); 

					// copy cloned button into span that we can clear later
					$('#twitterShare').append(clone);

					// reload twitter scripts to force them to run, converting a to iframe
					$.getScript("http://platform.twitter.com/widgets.js");
				})
				.fail(function() {
					alert("Oops... Something went wrong")
			});
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
		mixpanel.identify();
		mixpanel.people.increment("Buy Count");

		mixpanel.track("Buy Item", {"url": href}, function() {
			window.open(href,'_blank');
		})
	});


});
