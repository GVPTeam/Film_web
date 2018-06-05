var w,h,className;
function getSrceenWH(){
	w = $(window).width();
	h = $(window).height();
	$('#lightbox').width(w).height(h);
}

window.onresize = function(){  
	getSrceenWH();
}  

$(window).resize();  

$(function(){
	getSrceenWH();

	$('#top a').click(function(){
		className = $(this).attr('class');
		$('#lightbox').fadeIn(300);
		$('#login-wrap').removeAttr('class').addClass('animated '+className+'').fadeIn();
	});

	$('.claseDialogBtn').click(function(){
		$('#dialogBg').fadeOut(300,function(){
			$('#dialog').addClass('bounceOutUp').fadeOut();
		});
	});
});