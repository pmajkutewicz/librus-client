var graphicMenuMinHeight = 20;
var graphicMenuMaxHeight = 50;
var resetGraphicMenu = false;

if(!String.prototype.trim) {
    String.prototype.trim = function() {
        return $.trim(this);
    };
}

var resizeButtons = function() {
    if( $("a.button").not(".dont-calculate").length > 0 ) {
        $("a.button").not(".dont-calculate").each(function(){
            var buttonWidth = parseInt( $(this).children("span.button-start").width() ) + parseInt( $(this).children("span.button-end").width() ) + ( parseInt( $(this).children("span.button-start").css("padding-left") ) * 2 );
            $(this).width( buttonWidth );
        });
    }
}

$(document).ready(function() {
    $(".justify").each(function(){
        improve_justification( $(this) );
    });
    //reset_graphic_menu();
    if( $( ".draggable" ).length > 0 ) {
        $( ".draggable" ).draggable();
    }
    if( $( ".warning-box.draggable" ).length > 0 ) {
        $( ".warning-box.draggable" ).css( "top", ( ( $(window).height()/2 ) - ( $( ".warning-box" ).height()/2 ) ) );
        $( ".warning-box.draggable" ).css( "left", ( ( $(window).width()/2 ) - ( $( ".warning-box" ).width()/2 ) ) );
    }
    
    $( ".warning-box span.warning-close" ).click( function(){
        $(this).parent().parent().css( "display", "none" );
    });

    $('.preloader-test').click(function(){
        turn_preloader_on();
        setTimeout( 'turn_preloader_off()', 5000 );
        return false;
    });

    $('.sidebar span.show').click(function() {
        var sidebar = $(this).parents('.sidebar').eq(0);
        sidebar.find('span.show').css("display", "none");
        if (sidebar.is('#interfejs-lekcyjny')) {
            if( $('#body').find(".container.static").length == 0 ) {
                $('#body').stop().animate({
                    'padding-left': parseInt( sidebar.width()+10 )
                }, 
                300,
                function(){
                    $.each($.browser, function(i, val) {
                        if( i == 'chrome' ) {
                            var windowTop = $(document).scrollTop()
                            $('.container').each(function(){
                                if( $(this).css('display') != "none" ) {
                                    $(this).css('display','none');
                                    $(this).offset();
                                    $(this).css('display','block');
                                }
                            });
                            $(document).scrollTop( windowTop );
                        }
                    });
                });
            }
            
            $.ajax({
                type: "POST",
                url: '/ajax/stan_minimalizacji_interfejsu.php',
                data: 'isInterfaceMin=' + 0
            });
        }
        
        sidebar.stop().animate({
                left: '0'
            }, 
            300,
            function(){
                sidebar.find('span.hide').css("display", "block");
        });
    });
    $('.sidebar span.hide').click(function() {
        var sidebar = $(this).parents('.sidebar').eq(0);
        if (sidebar.is('#interfejs-lekcyjny')) {
            $('#body').stop().animate({
                    'padding-left': '50'
                },
                300,
                function(){
                    $.each($.browser, function(i, val) {
                        if( i == 'chrome' ) {
                            var windowTop = $(document).scrollTop()
                            $('.container').each(function(){
                                if( $(this).css('display') != "none" ) {
                                    $(this).css('display','none');
                                    $(this).offset();
                                    $(this).css('display','block');
                                }
                            });
                            $('.warning-box').each(function(){
                                if( $(this).css('display') != "none" ) {
                                    $(this).css('display','none');
                                    $(this).offset();
                                    $(this).css('display','block');
                                }
                            });

                            $(document).scrollTop( windowTop );
                        }
                    });
            });
        
            $.ajax({
                type: "POST",
                url: '/ajax/stan_minimalizacji_interfejsu.php',
                data: 'isInterfaceMin=' + 1
            });
        }
        
        sidebar.stop().animate({
                left: ( ( parseInt( sidebar.width() ) + 1 ) * -1 )
            }, 
            300,
            function(){
                sidebar.find('span.show').css("display", "block");
        });
    });

    $.datepicker.regional['pl'] = {
        monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
        monthNamesShort: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
        dayNames: ['Niedziela','Poniedzialek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
        dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'], 
        dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
        dateFormat: 'yy-mm-dd', 
        firstDay: 1,
        prevText: '&#x3c; Poprzedni', 
        prevStatus: 'Pokaż poprzedni miesiąc',
        prevJumpText: '&#x3c;&#x3c;', 
        prevJumpStatus: '',
        nextText: 'Następny &#x3e;', 
        nextStatus: 'Pokaż następny miesiąc',
        nextJumpText: '&#x3e;&#x3e;', 
        nextJumpStatus: '',
        currentText: 'Dziś', 
        currentStatus: 'Pokaż aktualny miesiąc',
        todayText: 'Dziś', 
        todayStatus: 'Pokaż aktualny miesiąc',
        clearText: 'Wyczyść', 
        clearStatus: 'Wyczyść obecną datę',
        closeText: 'Zamknij', 
        closeStatus: 'Zamknij bez zapisywania',
        yearStatus: 'Pokaż inny rok', 
        monthStatus: 'PokaĹź inny miesiąc',
        weekText: 'Tydz', 
        weekStatus: 'Tydzień roku',
        dayStatus: '\'Wybierz\' D, M d', 
        defaultStatus: 'Wybierz datę',
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['pl']);
    
    var headerZindex = $("#header").zIndex();
    
    $("input.datetimepicker").each(function(){
        $(this).css({"position":"relative"});
        var zIndex = $(this).zIndex();
        
        if( zIndex < ( headerZindex - 2 ) ) {
            zIndex = ( headerZindex - 2 );
        }
        
        $(this).css({"position":"relative","z-index":zIndex});
        $(this).datepicker({
            changeMonth: true,
            changeYear: true,
            changeMonthUseLongNames: true,
            yearRange: "-5:+1"
        });
    });
    
    $("input.date-pick").each(function(){
        $(this).css({"position":"relative"});
        var zIndex = $(this).zIndex();
        
        if( zIndex < ( headerZindex - 2 ) ) {
            zIndex = ( headerZindex - 2 );
        }
        
        $(this).css({"position":"relative","z-index":zIndex});
        $(this).datepicker({
            changeMonth: true,
            changeYear: true,
            changeMonthUseLongNames: true,
            yearRange: "-5:+1"
        });
    });
    $("input.date-pick").mask("9999-99-99");
    $("input.date-pick").change(function(){
        var tmp = $(this).val();
        var rxDatePattern = /^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/;
        var dtArray = tmp.match(rxDatePattern);
        if (dtArray == null) {
            $(this).val( tmp );
        } else {
            var dtYear = dtArray[1];
            var dtMonth= dtArray[3];
            var dtDay = dtArray[5];

            if( dtMonth > 12 ) {
                dtMonth = 12;
            } else if( dtMonth < 1 ) {
                dtMonth = 1;
            }
            if( dtDay > 31 ) {
                dtDay = 31;
            } else if( dtDay < 1 ) {
                dtDay = 1;
            }

            $(this).val( dtYear+"-"+dtMonth+"-"+dtDay );
        }
    });

    if( $('#preloader').length > 0 ) {
        $('#preloader').css( "left", ( ( $(window).width() / 2 ) - ( $('#preloader').width() / 2 ) ) );
        $('#preloader').css( "top", ( ( $(window).height() / 2 ) - ( $('#preloader').height() / 2 ) ) );
    }

    var wyliczWysokosciKonteneraWidgetow = function () {
        var idwZakladkaProfiluKlasyHeight = 0;
        if ($('#idw-zakladka-profilu-klasy').length > 0) {
            idwZakladkaProfiluKlasyHeight = $('#idw-zakladka-profilu-klasy').height();
            idwZakladkaProfiluKlasyHeight = idwZakladkaProfiluKlasyHeight;
            $('#idw-zakladka-profilu-klasy').css("top", 0);
        }

        var idwZakladkaILHeight = 0;
        if ($('#interfejs-lekcyjny').length > 0) {
            idwZakladkaILHeight = $('#interfejs-lekcyjny').height();
            if ($('#idw-zakladka-profilu-klasy').length > 0) {
                $('#interfejs-lekcyjny').css("top", idwZakladkaProfiluKlasyHeight);
            } else {
                $('#interfejs-lekcyjny').css("top", 0);
            }
        }

        var wysokoscKontenera = idwZakladkaProfiluKlasyHeight + idwZakladkaILHeight;
        $('#left-widgets-container').height(wysokoscKontenera);

        if ($(window).height() < (wysokoscKontenera + $("#body").offset().top)) {
            $('#left-widgets-container').css("position", "absolute");
            $('#left-widgets-container').css( "top", $("#body").offset().top);
        } else {
            $('#left-widgets-container').css("position", "fixed");
            $('#left-widgets-container').css( "top", $("#body").offset().top);
        }
    };

    if ($('#left-widgets-container').length > 0) {
        wyliczWysokosciKonteneraWidgetow();
        $(window).resize(function(){
            wyliczWysokosciKonteneraWidgetow();
        });
    }

    /*
    if( !(navigator.appVersion.indexOf("MSIE 7.") != -1) ) {
        if( $('#interfejs-lekcyjny').length > 0 ) {
            var idwZakladkaProfiluKlasyHeight = 0;
            if( $('#idw-zakladka-profilu-klasy').length > 0 ) {
                idwZakladkaProfiluKlasyHeight = $('#idw-zakladka-profilu-klasy').height();
            }
            
            if( $(window).height() < ( $('#interfejs-lekcyjny').height() + $("#body").offset().top + idwZakladkaProfiluKlasyHeight + 50 ) ) {
                var interfejsLekcyjnyPosition = $('#interfejs-lekcyjny').position();
                $('#interfejs-lekcyjny').css( "position", "absolute" );
                if ($('#idw-zakladka-profilu-klasy').length > 0) {
                    $('#idw-zakladka-profilu-klasy').css( "position", "absolute" );
                }
                if( interfejsLekcyjnyPosition.top < $("#body").offset().top + idwZakladkaProfiluKlasyHeight ) {
                    $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight );
                } else {
                    if ($('#idw-zakladka-profilu-klasy').length > 0) {
                        $('#interfejs-lekcyjny').css( "top", interfejsLekcyjnyPosition.top + 50);
                    } else {
                        $('#interfejs-lekcyjny').css( "top", interfejsLekcyjnyPosition.top);
                    }
                }
            } else {
                $('#interfejs-lekcyjny').css( "position", "fixed" );
                if ($('#idw-zakladka-profilu-klasy').length > 0) {
                    $('#idw-zakladka-profilu-klasy').css( "position", "fixed" );
                    $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight + 50 );
                } else {
                    $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight );
                }
            }
        }
    }
    
    $(window).resize(function(){
        if( !(navigator.appVersion.indexOf("MSIE 7.") != -1) ) {
            if( $('#interfejs-lekcyjny').length > 0 ) {
                var idwZakladkaProfiluKlasyHeight = 0;
                if( $('#idw-zakladka-profilu-klasy').length > 0 ) {
                    idwZakladkaProfiluKlasyHeight = $('#idw-zakladka-profilu-klasy').height();
                }
                
                if( $(window).height() < ( $('#interfejs-lekcyjny').height() + $("#body").offset().top + idwZakladkaProfiluKlasyHeight + 50 ) ) {
                    var interfejsLekcyjnyPosition = $('#interfejs-lekcyjny').position();
                    $('#interfejs-lekcyjny').css( "position", "absolute" );
                    if ($('#idw-zakladka-profilu-klasy').length > 0) {
                        $('#idw-zakladka-profilu-klasy').css( "position", "absolute" );
                    }
                    if( interfejsLekcyjnyPosition.top < $("#body").offset().top + idwZakladkaProfiluKlasyHeight ) {
                        $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight );
                    } else {
                        if ($('#idw-zakladka-profilu-klasy').length > 0) {
                            $('#interfejs-lekcyjny').css( "top", interfejsLekcyjnyPosition.top + 50);
                        } else {
                            $('#interfejs-lekcyjny').css( "top", interfejsLekcyjnyPosition.top);
                        }
                    }
                } else {
                    $('#interfejs-lekcyjny').css( "position", "fixed" );
                    if ($('#idw-zakladka-profilu-klasy').length > 0) {
                        $('#idw-zakladka-profilu-klasy').css( "position", "fixed" );
                        $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight + 50 );
                    } else {
                        $('#interfejs-lekcyjny').css( "top", $("#body").offset().top + idwZakladkaProfiluKlasyHeight );
                    }
                }
            }
        }
        if( $('#preloader').length > 0 ) {
            $('#preloader').css( "left", ( ( $(window).width() / 2 ) - ( $('#preloader').width() / 2 ) ) );
            $('#preloader').css( "top", ( ( $(window).height() / 2 ) - ( $('#preloader').height() / 2 ) ) );
        }
    });
    */
    
        if( $('a[title]').length > 0 ) {
            $('a[title]').tooltip({
                track: true,
                show: {
                    delay: 200,
                    duration: 200
                },
                hide: {
                    delay: 100,
                    duration: 200
                }
            });
        }
        if( $('input[title]').length > 0 ) {
            $('input[title]').tooltip({
                track: true,
                show: {
                    delay: 200,
                    duration: 200
                },
                hide: {
                    delay: 100,
                    duration: 200
                }
            });
        }
        if( $('td[title]').length > 0 ) {
            $('td[title]').tooltip({
                track: true,
                show: {
                    delay: 200,
                    duration: 200
                },
                hide: {
                    delay: 100,
                    duration: 200
                }
            });
        }
        if( $('.tooltip[title]').length > 0 ) {
            $('.tooltip[title]').tooltip({
                track: true,
                show: {
                    delay: 200,
                    duration: 200
                },
                hide: {
                    delay: 100,
                    duration: 200
                }
            });
        }
    
    

    /*
    $("#graphic-menu ul li").mousemove(function(e){
        resetGraphicMenu = false;
        var XPosition = (e.pageX - $(this).offset().left);
        var width = $(this).width();
        var height = ( ( -(1/2.25)*( ( ( XPosition / width )-0.5)*( ( XPosition / width )-0.5) ) + 1 ) * graphicMenuMaxHeight );

        var height_next = ( ( -(1/2.25)*( ( ( XPosition / width )-1.5)*( ( XPosition / width )-1.5) ) + 1 ) * graphicMenuMaxHeight );
        var height_prev = ( ( -(1/2.25)*( ( ( XPosition / width )+0.5)*( ( XPosition / width )+0.5) ) + 1 ) * graphicMenuMaxHeight );


        if( height < graphicMenuMinHeight ) {
            height = graphicMenuMinHeight
        } else if( height > graphicMenuMaxHeight ) {
            height = graphicMenuMaxHeight
        }
        if( height_prev < graphicMenuMinHeight ) {
            height_prev = graphicMenuMinHeight
        } else if( height_prev > graphicMenuMaxHeight ) {
            height_prev = graphicMenuMaxHeight
        }
        if( height_next < graphicMenuMinHeight ) {
            height_next = graphicMenuMinHeight
        } else if( height_next > graphicMenuMaxHeight ) {
            height_next = graphicMenuMaxHeight
        }

        $("#graphic-menu ul li a img").height( graphicMenuMinHeight );
        $(this).find("a img").height( height );

        $(this).prev().find("a img").height( height_prev );
        $(this).next().find("a img").height( height_next );

        var ulWidth = 0;
        $("#graphic-menu ul li").each(function(){
            ulWidth += $(this).width()+20;
        });
        $("#graphic-menu").width( ulWidth+5 );
        $("#graphic-menu ul").width( ulWidth+5 );
    });
    */
   refreshFoldMenus();
    
    /*
    $("#graphic-menu ul").mouseout(function(){
        resetGraphicMenu = true;
        setTimeout('reset_graphic_menu();',500);
    });
    */
   
    $( ".button-set .advanced-button" ).not('.ui-button').button({
        text: true,
        icons: {
            secondary: "ui-icon-triangle-1-s"
        }
    }).click(function() {
        $('.button-set ul').not( $( this ).parent().next() ).hide();
        var menu = $( this ).parent().next().stop().animate({
            height: "toggle"
        }, 100);
        $( document ).one( "click", function() {
            menu.hide();
        });
        return false;
    }).parent().next().hide().css({"z-index": $(this).parent().zIndex()+1}).menu().buttonset();
    
    if( $("select option[style]").length > 0 ) {
        $("select option[style]").parent().one().each(function(){
            change_select_colors_from_background( this );
        });
    }
    
    if( $("#page.no-head .container").not(".static").children("span.fold").length > 0 ) {
        var bodyPaddingLeft = parseInt( $("#body").css("padding-left") );
        $(".container").not(".static").children("span.fold").parent().one().each(function(){
            if( ( $(this).width() + bodyPaddingLeft ) > $(window).width() ) {
                $(this).children("span.fold").css("right", ( $(this).width() + bodyPaddingLeft ) - $(window).width() );
            }
        });
    }
    
    $(window).resize(function(){
        if( $("#page.no-head .container").not(".static").children("span.fold").length > 0 ) {
            var bodyPaddingLeft = parseInt( $("#body").css("padding-left") );
            $(".container").not(".static").children("span.fold").parent().one().each(function(){
                if( ( $(this).width() + bodyPaddingLeft ) > $(window).width() ) {
                    $(this).children("span.fold").css("right", ( ( $(this).width() + bodyPaddingLeft ) - $(window).width() ) - $(document).scrollLeft() );
                } else {
                    $(this).children("span.fold").css("right", 0 );
                }
            });
        }
    });
    $(document).scroll(function(){
        if( $("#page.no-head .container").not(".static").children("span.fold").length > 0 ) {
            var bodyPaddingLeft = parseInt( $("#body").css("padding-left") );
            $(".container").not(".static").children("span.fold").parent().one().each(function(){
                if( ( $(this).width() + bodyPaddingLeft ) > $(window).width() ) {
                    $(this).children("span.fold").css("right", ( ( $(this).width() + bodyPaddingLeft ) - $(window).width() ) - $(document).scrollLeft() );
                } else {
                    $(this).children("span.fold").css("right", 0 );
                }
            });
        }
    });
    
    resizeButtons();
    handleSingleSubmitButtons();
});

$(window).load(function(){
    $(".container.with-bookmarks").each(function(){
        refreshBookmarks($(this));
    });
    resizeButtons();
});

$(document).on('click', '.dictionary-item[data-id]', function () {
    var users = $(this).parents('[dictionary-users]');
    if (users.length < 1) {
        var buttons = ["ok"];
        show_message( "error small", "Błąd", "Brak użytkowników, dla których odpytany ma być słownik.", buttons );
    } else if (users.length > 1) {
        var buttons = ["ok"];
        show_message( "error small", "Błąd", "Niejednoznaczna lista użytkowników, dla których odpytany ma być słownik.", buttons );
    } else {
        turn_preloader_on();
        $.ajax({
            dataType: "json",
            type: "post",
            url: '/ajax/indywidualni/slownik/wyrazenieSlownikowe',
            data: {
                wID: $(this).attr('data-id'),
                uIDs: users.attr('dictionary-users')
            },
            success: function(data){
                turn_preloader_off();
                if (data["SUCCESS"]) {
                    var message = show_message("information big", "Słownik", '', [], true);
                    message.find(".warning-content").html(data["CONTENT"]).promise().done(function() {
                        message.data("show_message_api").center();
                        message.find("img").load(function() {
                            message.data("show_message_api").center();
                        });
                    });
                } else {
                    var buttons = ["ok"];
                    $.each(data["ERRORS"], function(index, value) {
                        show_message("error small", "Błąd", value, buttons);
                    });
                }
            },
            error: function(){
                turn_preloader_off();
                var buttons = ["ok"];
                show_message( "error small", "Błąd", "Wystąpił błąd podczas ładowania wyrażenia słownikowego.", buttons );
            }
        });
    }
});

$(document).on('click', '.dictionary-item-container img[data-id]', function () {
    var img = $(this).clone();
    img.removeAttr('class').css({
      'display': "block",
      'margin': "auto",
      'max-height': "100%",
      'max-width': "90%"
    });
    var modal = show_message( "information big", "", img, null, true ).find('.warning-title').remove().end();
    modal.find('.warning-content').css('height', modal.find('.warning-content').css('max-height')).promise().done(function(){
        modal.data("show_message_api").center();
    });
});