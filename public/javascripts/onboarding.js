$(document).ready(function() {

	$(".header").hide();

	// It's a new visitor variable so we can show introduction modal to new users on Collection feed.
	if(localStorage.getItem("newVisitor") == null) {
		localStorage.setItem("newVisitor", "true");
	}

	if (!Modernizr.localstorage) {
		alert("NO LOCAL STORAGE");
	}
});
