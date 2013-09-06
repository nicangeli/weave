var AMOUNT_OF_PRODUCTS = 20;

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {
	// hide all elements at the start, bar the first one
	for(var i = 1; i < AMOUNT_OF_PRODUCTS; i++) {
		$('[data-number="product' + i + '"]').hide();
	}

	$(".like").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number');

		var likes = localStorage.getObj("likes");
		var likeCount = localStorage.getObj("likes").length;
		var dislikes = element - likeCount;
		
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

		mixpanel.track("SeeItem", {
			"Seen" : element,
			"Likes" : likeCount,
			"Dislikes" : element - likeCount
		});

		updateHanger();

		// anything that has a data-number attr of element, hide it
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});

	$(".dislike").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number');
		var likeCount = localStorage.getObj("likes").length;
		var dislikes = element - likeCount;
		mixpanel.track("SeeItem", {
			"Seen" : element,
			"Likes" : likes,
			"Dislikes" : dislikes
		});
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});

});

var changeProduct = function(currentProduct) {
	var num = parseInt(currentProduct.split("product")[1]),
		next = num + 1,
		nextId = "product" + next;
	if($('[data-number=' + nextId + ']').length == 0) {
		window.location = "/email";
	} else {
		$('[data-number=' + nextId + ']').each(function() {
			$(this).show();
		});
	}
};

var updateHanger = function() {
	$("a.hanger").html("<img src='/images/coat-hanger-white.png', style='width: 18px'> My Collection (" + localStorage.getObj("likes").length + ")").show();
}