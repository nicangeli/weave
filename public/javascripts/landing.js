$(document).ready(function() {
	$('.email').hide()

	$(".getApp").click(function(e){
		e.preventDefault();
		mixpanel.track("Download App Main");
		$('.getApp').hide();
		$('.email').show();
	});

	$(".submitEmail").click(function(){
		email = $("input.landingForm").val();
		console.log(email);
		mixpanel.track("Email 4 Download", {"email" : email}, function() {
			window.location="https://itunes.apple.com/gb/app/weave-fashion/id725215782?mt=8&ign-mpt=uo%3D4";
		});

	})
});
