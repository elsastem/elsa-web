// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    //Lose the widows
    var list = ['li', 'p'];
    list.forEach(function(tag){
        $(tag).each(function() { 
            $(this).html($(this).html().replace(/\s([^\s<]+)\s*$/,'&nbsp;$1'));
        }); 
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 100),
        }, 1250, 'easeInOutExpo', function() {
            $($anchor.attr('href')).focus();
        });
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });
})(jQuery); // End of use strict
