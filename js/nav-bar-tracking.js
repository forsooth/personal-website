$(document).ready(function() {
        initY = $('.nav-list').children('li').first().height();
        
        $('.nav-element').mousemove(function(e) {
                var mouseY = e.pageY;
                height = $('.nav-element').height();
		if (mouseY + (height / 4) > initY) {
			if ($(this).children('a').first.css(',margin-top') != (initY - height) + "px") {
				$(this).children('a').first().css('margin-top', (initY - height) + "px");
			}
		} else {
                	$(this).children('a').first().css('margin-top', mouseY - height / 4 + "px");
        	}
	});        

});

function mainLoop() {
        initY = $('.nav-list').children('li').first().height();
        
        $('.nav-element').children('a').each(function() {
                var currentY = $(this).offset().top;
                var currentHeight = $(this).height();
                        
                if (!($(this).is(":hover")) && currentY < initY - currentHeight) {
                        if (initY - currentHeight - currentY > 5) {
                                $(this).css('margin-top', (currentY + 5) + "px");
                        } else {
                                $(this).css('margin-top', (initY - currentHeight) + "px");
                        }
                }

        });
}

window.setInterval(mainLoop, 20);
