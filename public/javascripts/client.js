$(document).ready(function() {

	var collection = $(".weaveFrame").attr("data-collectionName")
	var howFarThrough;
	console.log(collection);
	if(localStorage.getItem(collection) == null) {
		// hide all elements at the start, bar the first one
		for(var i = 1; i < $(".weaveFrame").children().length; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
	} else {
		howFarThrough = parseInt(localStorage.getItem(collection));
		for(var i = 0; i < howFarThrough; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
		for(var i = howFarThrough+1; i < $(".weaveFrame").children().length; i++ ) {
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
		localStorage.setItem("firstLike", "false");	
		var element = $(this).attr('data-number');




		var product = {};
			product.url = $(this).attr("data-url");
			product.price = $(this).attr("data-price");
			product.shop = $(this).attr("data-shop");
			product.imageUrl = $(this).attr("data-imageUrl");
			product.type = $(this).attr("data-type");
			product.brand = $(this).attr("data-brand");

		var data = {
			collectionName: $(".weaveFrame").attr('data-collectionName'),
			product: product
		};

		
		$.post('/likeProduct', data)
			.done(function() {
				// anything that has a data-number attr of element, hide it
				$('[data-number=' + element + ']').hide();
				changeProduct(element);
			})
			.fail(function() {
				alert('Oops... something went wrong');
			});

	});

		

	$(".dislike").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number');
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});

	// clicking either of the buttons should trigger localStorage seen count for this collection to increase
	$(".like, .dislike").click(function(e) {
		var collection = $(".weaveFrame").attr('data-collectionName');
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