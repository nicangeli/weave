$(document).ready(function() {

	var collection = $(".collections").attr("data-collectionName")
	var howFarThrough;
	if(localStorage.getItem(collection) == null) {
		// hide all elements at the start, bar the first one
		for(var i = 1; i < $(".collection").children().length; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
	} else {
		howFarThrough = parseInt(localStorage.getItem(collection));
		for(var i = 0; i < howFarThrough; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
		for(var i = howFarThrough+1; i < $(".collection").children().length; i++ ) {
			$('[data-number="product' + i + '"]').hide();
		}
	}



	$(".like").hover(function() {
		$(this).attr("src", "/images/likeHeartClick.png");
	}, function() {
		$(this).attr("src", "/images/likeHeart.png")
	});

	$(".dislike").hover(function() {
		$(this).attr("src", "/images/dislikeCrossClick.png");
	}, function() {
		$(this).attr("src", "/images/dislikeCross.png")
	});

	$(".like").click(function(e) {
		e.preventDefault();
		if(localStorage.getItem("firstLike") != "false") {
			alertify.alert("You've liked something! We've added this to your collection (top right corner)");
			localStorage.setItem("firstLike", "false");
		}
		var element = $(this).attr('data-number');

		// Push to Mixpanel
		mixpanel.track("Like Item", {
			"Item" : $(this).attr("data-url")
		});

		var likes = localStorage.getObj("likes");
		
		var tmp = {};
			tmp.url = $(this).attr("data-url");
			tmp.price = $(this).attr("data-price");
			tmp.shop = $(this).attr("data-shop");
			tmp.imageUrl = $(this).attr("data-imageUrl");
			tmp.type = $(this).attr("data-type");
			tmp.brand = $(this).attr("data-brand");
		if(likes == null) {
			likes = [tmp];
			localStorage.setObj("likes", likes);
		} else {
			likes.push(tmp);
			localStorage.setObj("likes", likes);
		}

		updateHanger();

		// anything that has a data-number attr of element, hide it
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});

	$(".dislike").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number');
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});

	// clicking either of the buttons should trigger localStorage seen count for this collection to increase
	$(".like, .dislike").click(function(e) {
		var collection = $(".collection").attr('data-collectionName');
		var seenCount = localStorage.getItem(collection);
		if(seenCount == null) {
			localStorage.setItem(collection, 1);
		} else {
			localStorage.setItem(collection, parseInt(localStorage.getItem(collection)) + 1);
		}
	})

});

var changeProduct = function(currentProduct) {
	var num = parseInt(currentProduct.split("product")[1]),
		next = num + 1,
		nextId = "product" + next;
	if($('[data-number=' + nextId + ']').length == 0) {
		window.location = "/likes";
	} else {
		$('[data-number=' + nextId + ']').each(function() {
			$(this).show();
		});
	}
};

var updateHanger = function() {
	$("a.hanger").html("<img src='/images/coat-hanger.png'> <span class='collectionTag'>My Collection</span> (" + localStorage.getObj("likes").length + ")").show();
}