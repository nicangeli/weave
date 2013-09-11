Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {
	
	$("#products").hide();

	$("#understand").click(function(e) {
		e.preventDefault();
		$("#products").show();
		
	});

});