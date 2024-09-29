/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    $(document).scroll(function() {
        var header = $("#header");
        if (header.find("#main-navigation-container").length > 0) {
            if ($(window).scrollTop() > (header.offset().top + header.height() + 10)) {
                if (!header.hasClass("fixed")) {
                    header.addClass("fixed").find("#main-navigation-container").css("top", (-1 * $("#main-navigation-container").height())).promise().done(function(){
                        $("#main-navigation-container").animate({top: 0}, 100);
                    });
                }
            } else if ($(window).scrollTop() < (header.offset().top + header.height())) {
                if (header.hasClass("fixed")) {
                    $("#main-navigation-container").animate({top: (-1 * $("#main-navigation-container").height())}, 50, function() {
                        header.removeClass("fixed");
                    });
                }
            }
        }
    });
    
    $(".main-menu-list .no-access>a").each(function( index ) {
        $(this).append('<img src="/images/pomoc_ciemna.png" />');
    });
});