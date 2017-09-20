$(document).ready(function() {
        // Grab height of whole column
        initY = $('.nav-list').children('li').first().height();
        
        // When mouse is over the box
        $('.nav-element').mousemove(function(e) {
                // Find mouse Y-coordinate
                var mouseY = e.pageY;
                // set 'height' to be the height of the square
                height = $('.nav-element').height();
                // if mouse Y coordinate 
                if ((mouseY - height / 4) <= 0) {
                        $(this).children('a').first().css('margin-top', "0px");
                }
                else if (mouseY + (height / 4) >= initY) {
                        // get margin above current box
                        bmargin = $(this).children('a').first().css('margin-top') 
                        if (bmargin != (initY - height) + "px") {
                                $(this).children('a').first().css('margin-top', (initY - height / 2) + "px");
                        }
                } else {
                        $(this).children('a').first().css('margin-top', mouseY - height / 4 + "px");
                }
        });        

});

function mainLoop() {
        // Grab height of whole column
        initY = $('.nav-list').children('li').first().height();
        
        // When mouse isn't over a box
        $('.nav-element').children('a').each(function() {
                var currentY = $(this).offset().top;
                var currentHeight = $(this).height();
                        
                if (!($(this).is(":hover")) && currentY < initY - currentHeight) {
                        if (initY - currentHeight - currentY > 5 && currentY >= 0) {
                                $(this).css('margin-top', (currentY + 5) + "px");
                        } else {
                                $(this).css('margin-top', (initY - currentHeight) + "px");
                        }
                }

        });
}

window.setInterval(mainLoop, 20);
