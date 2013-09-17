$(document).ready(function() {
	// for each collection name, check that we've not seen it all 
	// and that it is not empty
	$(".product").each(function() {
		var through = $(this).find(".through"),
			size = $(this).find(".size");



		var beenThrough = localStorage.getItem($(this).attr('data-collectionName')),
			size = parseInt(size.text());

		if(beenThrough != null) { // been through before
			// hide the elements that we have seen all of
			if(parseInt(beenThrough) >= size) { // have we seen all of the products
				$(this).hide();
				$($(this).siblings('.row')[0]).hide();
			}
			through.text(beenThrough + '/');
			var throughVal = parseInt(through.text().split('/')[0]);
			$($(this).find('.progress-bar')[0]).attr('style', 'width: ' + (throughVal/parseInt(size))*100 + '%;');
			//$(this).find('.progress-bar').css({"width": "cock"});

			//through.text(beenThrough + '/');
			//$(this).next('.progress-.attr("style", "width: " + (through/size)*100 + "%;");
		} else {
		}
		// are things still visible? 
		if($(".product :visible").length == 0) {
			$('.container').append("<h2 style='text-align: center;'>You've Weaved us out, there are no unplayed Collections</h2><h4 style='text-align: center'>Come back tomorrow for more Collections</h4>")
		}
	});

	$(".playButton").click(function(e) {
		e.preventDefault();
		var collectionUrl = $(this).data("url"),
			collectionName = collectionUrl.split("/")[2];

		mixpanel.identify();
		mixpanel.people.increment("Collections Played");
		mixpanel.track("Play Collection", {
			"Collection Name": collectionName
		}, function() {
			window.location = collectionUrl;
		});
	});
	
	$(".createCollection").click(function(e) {
		alertify.alert("We are currently in Beta and this feature has not yet been built. It will be soon!");
		mixpanel.track("Create Collection");
	});
	

});