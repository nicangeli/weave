$(document).ready(function() {
	// for each collection name, check that we've not seen it all 
	// and that it is not empty
	$("li.collection").each(function() {
		var through = $(this).find(".through"),
			size = $(this).find(".size");


		var beenThrough = localStorage.getItem($(this).attr('data-collectionName')),
			size = parseInt(size.text());

		if(beenThrough != null) {
			// hide the elements that we have seen all of
			if(parseInt(beenThrough) === size) {
				$(this).hide();
			}

			through.text(beenThrough + '/');
		}
		if(parseInt(size) === 0) {
			$(this).hide();
		}
		// are things still visible? 
		if($("li.collection :visible").length == 0) {
			$('body').append("<h1>No collections left to visit. Come back tomorrow</h1>")
		}

	});
	
});