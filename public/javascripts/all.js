Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function() {
	if(localStorage.getObj("likes") == null) {
		$("a.hanger").hide();
	} else {
		$("a.hanger").html("<img src='/images/coat-hanger-white.png', style='width: 18px'> My Collection (" + localStorage.getObj("likes").length + ")")
	}
})