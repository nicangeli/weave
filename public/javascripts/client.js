Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {

	var firstLike = true;
	var d = new Date(),
		dateString = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

	var today = localStorage.getObj(dateString);
	if(today == null) {
		today = [true];
		localStorage.setObj(dateString, today);
	} else {
		today.push(true);
		localStorage.setObj(dateString, today)
	}
	//today.push(true);
	//localStorage.setObj(dateString, today);

	// hide all elements at the start, bar the first one
	for(var i = 1; i < $(".collections").children().length; i++) {
		$('[data-number="product' + i + '"]').hide();
	}

	$(".like").click(function(e) {
		if(firstLike) {
			alertify.alert("You've liked something! We've added this to your collection (top right corner)");
		}
		firstLike = false;
		e.preventDefault();
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
		//var num = parseInt(element.split("product")[1]);	

		// Define Mixpanel properties
		//var SeenCount = num + 1;
		/*if(localStorage.getObj("likes") == null) {
			var likeCount = 0;
		} else {
			var likeCount = localStorage.getObj("likes").length;
		};
		var dislikeCount = SeenCount - likeCount;*/

		// Push to Mixpanel
		mixpanel.track("Dislike Item", {
			"Item" : $(this).attr("data-url")
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