var AMOUNT_OF_PRODUCTS = 20;

$(document).ready(function() {
	// hide all elements at the start, bar the first one
	for(var i = 1; i < AMOUNT_OF_PRODUCTS; i++) {
		$('[data-number="product' + i + '"]').hide();
	}

	$(".like").click(function(e) {
		e.preventDefault();
		var element = $(this).attr('data-number');
		console.log(element);
		// anything that has a data-number attr of element, hide it
		$('[data-number=' + element + ']').hide();
		changeProduct(element);
	});
});

var changeProduct = function(currentProduct) {
	var num = parseInt(currentProduct.split("product")[1]),
		next = num + 1,
		nextId = "product" + next;
	//$('[data-number=' + nextId + ']').show();
	$('[data-number=' + nextId + ']').each(function() {
		$(this).show();
	})
};