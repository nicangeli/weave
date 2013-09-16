$(document).ready(function() {
	// for each collection name, check that we've not seen it all 
	// and that it is not empty
	$(".product").each(function() {
		var through = $(this).find(".through"),
			size = $(this).find(".size");


		var beenThrough = localStorage.getItem($(this).attr('data-collectionName')),
			size = parseInt(size.text());

		if(beenThrough != null) {
			// hide the elements that we have seen all of
			if(parseInt(beenThrough) === size) {
				$(this).hide();
				$(this).next().hide();
			}

			through.text(beenThrough + '/');
			$(".progress-bar").attr("style", "width: " + (through/size)*100 + "%;")
		}
		if(parseInt(size) === 0) {
			$(this).hide();
			$(this).next().hide();

		}
		// are things still visible? 
		if($(".product :visible").length == 0) {
			$('.container').append("<h2 style='text-align: center;'>You've Weaved us out, there are unplayed Collections</h2><h4 style='text-align: center'>Come back tomorrow for more Collections</h4>")
		}

	});

	$(".playButton img").hover(function() {
		$(this).attr("src", "/images/playButton-hover.png");
	}, function() {
		$(this).attr("src", "/images/playButton.png")
	});
	

});