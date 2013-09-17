$(document).ready(function() {
	
	$(".collections, .thanks").hide();
	$('.comment').hide();


	$("#understand").click(function(e) {
		e.preventDefault();
		$("#understand, #opinion, #welcome, .explain").hide();
		$(".collections, .collectionTitle").show();
		localStorage.setItem("friendName", $("#friendName").val());
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

	$("#sendComment").click(function(e) {
		e.preventDefault();
		var _id = $("[data-id]").attr('data-id');
		var data = {
			"data": {
				"_id": _id, 
				"friendName": localStorage.getItem("friendName"),
				"products": localStorage.getObj(_id),
				"comment": $("#comment").val()
			}
		};
		$.post("/friend/feedback", data)
			.done(function(data) {
				$(".collections").hide();
				$('.comment').hide();
				$(".thanks").show();
			})
			.fail(function(e) {
				console.log(e)
				alert("Oops... Something went wrong")
			});
	}) 

});

var changeProduct = function(currentProduct) {
	var num = parseInt(currentProduct.split("product")[1]),
		next = num + 1,
		nextId = "product" + next;
	if($('[data-number=' + nextId + ']').length == 0) {
		//window.location = "/thanks";
		// we have been through all of the products, show the thanks screens
		//and email the originalOwner
		$('.comment').show();

	} else {
		$('[data-number=' + nextId + ']').each(function() {
			$(this).show();
		});
	}
};