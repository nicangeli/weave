Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {
	
	$(".collections, .thanks").hide();


	$("#understand").click(function(e) {
		e.preventDefault();
		$("#understand, #opinion, .explain").hide();
		$(".collections").show();
		for(var i = 1; i < $(".collections").children().length; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
	});

	$(".like").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number'),
			_id = $(this).attr('data-id'),
			likes = localStorage.getObj(_id);

		var tmp = {};
			tmp.url = $(this).attr("data-url");
			tmp.price = $(this).attr("data-price");
			tmp.shop = $(this).attr("data-shop");
			tmp.imageUrl = $(this).attr("data-imageUrl");
			tmp.type = $(this).attr("data-type");
			tmp.brand = $(this).attr("data-brand");
		if(likes == null) {
			likes = [tmp];
			localStorage.setObj(_id, likes);
		} else {
			likes.push(tmp);
			localStorage.setObj(_id, likes);
		}
		
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

});

var changeProduct = function(currentProduct) {
	var num = parseInt(currentProduct.split("product")[1]),
		next = num + 1,
		nextId = "product" + next;
	if($('[data-number=' + nextId + ']').length == 0) {
		//window.location = "/thanks";
		// we have been through all of the products, show the thanks screens
		//and email the originalOwner
		var _id = $("[data-id]").attr('data-id');
		var data = {
			"data": {
				"friendName": localStorage.getItem("friendName"),
				"products": localStorage.getObj(_id)
			}
		};
		$.post("/friend/feedback", data)
			.done(function(data) {
				$(".collections").hide();
				$(".thanks").show();
			})
			.fail(function() {
				alert("Oops... Something went wrong")
			});

	} else {
		$('[data-number=' + nextId + ']').each(function() {
			$(this).show();
		});
	}
};