Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {
	
	$(".collections").hide();


	$("#understand").click(function(e) {
		e.preventDefault();
		$("#understand, #opinion, .explain").hide();
		$(".collections").show();
		for(var i = 1; i < $(".collections").children().length; i++) {
			$('[data-number="product' + i + '"]').hide();
		}
	});

});