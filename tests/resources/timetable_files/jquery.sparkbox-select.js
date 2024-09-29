/*

CUSTOM FORM ELEMENTS

Created by Ryan Fait
www.ryanfait.com

The only things you may need to change in this file are the following
variables: checkboxHeight, radioHeight and selectWidth (lines 24, 25, 26)

The numbers you set for checkboxHeight and radioHeight should be one quarter
of the total height of the image want to use for checkboxes and radio
buttons. Both images should contain the four stages of both inputs stacked
on top of each other in this order: unchecked, unchecked-clicked, checked,
checked-clicked.

You may need to adjust your images a bit if there is a slight vertical
movement during the different stages of the button activation.

The value of selectWidth should be the width of your select list image.

Visit http://ryanfait.com/ for more information.

*/

var checkboxHeight = "25";
var radioHeight = "25";


var nastepny_obiekt = function(obiekt) {
				do {
					if(obiekt) {
						obiekt = obiekt.nextSibling;
					}
				} while (obiekt && obiekt.nodeType != 1);
				
				return obiekt;
			};
            var zanzacz_wszystkich = function(sender)
			{
				var table = sender;
				do {
					table = nastepny_obiekt(table);
					if(table) {
						if(table.tagName == "TABLE") {
							break;
						}
					}
				} while (table);

				if(table) {
					var tr = table.tBodies[0].rows[0];
					for(var i = 0; i < tr.cells.length; ++i) {
						var cb = tr.cells[i].firstChild;
						do {
							if(cb) {
								if(cb.tagName == "INPUT" && cb.type == "checkbox") {
									cb.checked = sender.checked;
								}
							}
							
							cb = nastepny_obiekt(cb);
						} while (cb);
					} 
				}							
			};


var Custom = {
    init: function() {
        var checkboxes = $("input.styled[type=checkbox]"),radios = $("input.styled[type=radio]"), span;
        checkboxes.each(function(index){
            if( $(this).prev("span.checkbox").length > 0 ) {
                $(this).prev("span.checkbox").remove();
            }
            span = $(document.createElement('span'));
            
            var classes = $(this).attr('class');
            span.attr('class', classes+" checkbox" );
            span.removeClass("styled");

            span.css( "backgroundPosition", "0 0" );
            if( $(this).is(":checked") ) {
                var position = "0 -" + (checkboxHeight*2) + "px";
                span.css( "backgroundPosition", position );
            }

            span.insertBefore( $(this) );

            $(this).change( Custom.clear );
            

            if( $(this).is(":disabled") ) {
                span.attr('class', span.attr('class')+" disabled" );
                span.css( "backgroundPosition", "0 0" );
            } else {
                span.mousedown( Custom.pushed );
                span.mouseup( Custom.check );
                var input = this;
                span.mouseup( function(){ 
                    if( input.onclick ) {
                        input.sparkboxClick = input.onclick;
                        input.sparkboxClick();
                    }
                    if( input.onchange ) {
                        input.sparkboxChange = input.onchange;
                        input.sparkboxChange();
                    }
                } );
            }
        });
        radios.each(function(){
            if( $(this).prev("span.radio").length > 0 ) {
                $(this).prev("span.radio").remove();
            }
            span = $(document.createElement('span'));
            var classes = $(this).attr('class');
            span.attr('class', classes+" radio" );
            span.removeClass("styled");

            span.css( "backgroundPosition", "0 0" );
            if( $(this).is(":checked") ) {
                var position = "0 -" + (checkboxHeight*2) + "px";
                span.css( "backgroundPosition", position );
            }

            span.insertBefore( $(this) );

            $(this).change( Custom.clear );

            if( $(this).is(":disabled") ) {
                span.attr('class', span.attr('class')+" disabled" );
                span.css( "backgroundPosition", "0 0" );
            } else {
                span.mousedown( Custom.pushed );
                span.mouseup( Custom.check );
                var input = this;
                span.mouseup( function(){ 
                    if( input.onclick ) {
                        input.sparkboxClick = input.onclick;
                        input.sparkboxClick();
                    }
                    if( input.onchange ) {
                        input.sparkboxChange = input.onchange;
                        input.sparkboxChange();
                    }
                } );
            }
        });
    },
    pushed: function() {
        element = this.nextSibling;
        if(element.checked == true && element.type == "checkbox") {
            this.style.backgroundPosition = "0 -" + checkboxHeight*3 + "px";
        } else if(element.checked == true && element.type == "radio") {
            this.style.backgroundPosition = "0 -" + radioHeight*3 + "px";
        } else if(element.checked != true && element.type == "checkbox") {
            this.style.backgroundPosition = "0 -" + checkboxHeight + "px";
        } else {
            this.style.backgroundPosition = "0 -" + radioHeight + "px";
        }
    },
    check: function() {
        element = $(this).next();
        if(element.is(":checked") == true && element.attr("type") == "checkbox") {
            element.prev().css("background-position", "0 0");
            element.attr('checked', false);
        } else {
            if(element.attr("type") == "checkbox") {
                element.prev().css("background-position", "0 -" + checkboxHeight*2 + "px" );
            } else {
                element.prev().css("background-position", "0 -" + radioHeight*2 + "px" );
                group = element.attr("name");
                inputs = document.getElementsByTagName("input");
                for(a = 0; a < inputs.length; a++) {
                    if(inputs[a].name == group && $(inputs[a]) != element.next()) {
                        inputs[a].previousSibling.style.backgroundPosition = "0 0";
                    }
                }
            }
            
            element.attr('checked', true);
        }
        Custom.clear();
    },
    clear: function() {
        inputs = $("input[type=radio].styled,input[type=checkbox].styled");
        inputs.each(function(){
            if( $(this).attr("type") == "checkbox" ) {
                if( $(this).is(":checked") ) {
                    $(this).prev().css( "background-position", "0 -" + checkboxHeight*2 + "px" );
                } else {
                    $(this).prev().css( "background-position", "0 0" );
                }
            } else if( $(this).attr("type") == "radio" ) {
                if( $(this).is(":checked") ) {
                    $(this).prev().css( "background-position", "0 -" + radioHeight*2 + "px" );
                } else {
                    $(this).prev().css( "background-position", "0 0" );
                }
                
            }
        });
    }
}

$(document).ready(function(){
    //Custom.init();
});

/*
$(document).ready(function(){
    $("body").live("mouseover",function() {
        // Iterate over each select element
        $('select').not(".s-hidden").not(".ui-datepicker-month").not(".ui-datepicker-year").each(function() {

            // Cache the number of options
            var $this = $(this),
                numberOfOptions = $(this).children('option').length;

            // Wrap the select element in a div
            $this.wrap('<div class="select '+ $this.attr('class') +'"></div>');
            // Hides the select element
            $this.addClass('s-hidden');

            // Insert a styled div to sit over the top of the hidden select element
            var selectClass = 'styledSelect';
            if( $this.hasClass( "small" ) ) {
                selectClass += ' small';
            }
            if( $this.hasClass( "medium" ) ) {
                selectClass += ' medium';
            }
            if( $this.hasClass( "big" ) ) {
                selectClass += ' big';
            }
            $this.after('<div class="'+selectClass+'"></div>');

            // Cache the styled div
            var $styledSelect = $this.next('div.styledSelect');

            // Show the first select option in the styled div
            $styledSelect.text($this.children('option[selected]').eq(0).text());

            // Insert an unordered list after the styled div and also cache the list
            var $list = $('<ul />', {
                'class': 'options'
            }).insertAfter($styledSelect);

            // Insert a list item into the unordered list for each select option
            for (var i = 0; i < numberOfOptions; i++) {
                $('<li />', {
                    text: $this.children('option').eq(i).text(),
                    rel: $this.children('option').eq(i).val()
                }).appendTo($list);
            }

            // Cache the list items
            var $listItems = $list.children('li');

            // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
            if( $(this).is(":disabled") ) {
                $styledSelect.addClass("disabled");
            } else {
                $styledSelect.click(function(e) {
                    e.stopPropagation();
                    
                    var $active = $(this).is('.active');
                    
                    $('div.styledSelect.active').each(function() {
                        $(this).next('ul.options').stop().animate({
                            height: 'toggle'
                        }, 100, function(){
                            $(this).hide();
                        });
                        $(this).removeClass('active');
                    });

                    if( !$active ) {
                        $(this).next('ul.options').stop().animate({
                            height: 'toggle'
                        }, 100, function(){
                            $(this).show();
                        });
                        $(this).addClass('active').next('ul.options').show();


                        var ulWidth;
                        if( $(this).hasClass('small') ) {
                            ulWidth = 70;
                        }
                        if( $(this).hasClass('medium') ) {
                            ulWidth = 120;
                        }
                        if( $(this).hasClass('big') ) {
                            ulWidth = 170;
                        }
                        $(this).next('ul.options').children('li').each(function() {
                            if( $(this).width() > ulWidth ) {
                                ulWidth = $(this).width();
                            }
                        });
                        $(this).next('ul.options').width( ulWidth );
                        $(this).next('ul.options').children('li').width( ulWidth );
                    }
                });
            }


            // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
            // Updates the select element to have the value of the equivalent option
            $listItems.click(function(e) {
                e.stopPropagation();
                $styledSelect.text($(this).text()).removeClass('active');
                $this.val($(this).attr('rel'));
                $list.hide();
                $this.change();
            });

            // Hides the unordered list when clicking outside of it
            $(document).click(function() {
                $styledSelect.removeClass('active');
                $list.hide();
            });
        });
    });
    $("body").live("mouseover",function() {
        $('div.styledSelect').not(".disabled").prev("select:disabled").each(function() {
            // Cache the styled div
            var $styledSelect = $(this).next('div.styledSelect');
            $styledSelect.addClass("disabled");

            // Show the first select option in the styled div
            $styledSelect.text($(this).children('option[selected]').eq(0).text());
            $styledSelect.unbind('click');
        });
        $('div.styledSelect.disabled').prev("select").not(":disabled").each(function() {
            // Cache the styled div
            var $styledSelect = $(this).next('div.styledSelect');
            $styledSelect.removeClass("disabled");

            // Show the first select option in the styled div
            $styledSelect.text($(this).children('option[selected]').eq(0).text());
            
            $styledSelect.click(function(e) {
                e.stopPropagation();
                $('div.styledSelect.active').each(function() {
                    $(this).next('ul.options').stop().animate({
                        height: 'toggle'
                    }, 100, function(){
                        $(this).hide();
                    });
                    $(this).removeClass('active');
                });

                $(this).next('ul.options').stop().animate({
                    height: 'toggle'
                }, 100, function(){
                    $(this).show();
                });
                $(this).addClass('active').next('ul.options').show();


                var ulWidth;
                if( $(this).hasClass('small') ) {
                    ulWidth = 70;
                }
                if( $(this).hasClass('medium') ) {
                    ulWidth = 120;
                }
                if( $(this).hasClass('big') ) {
                    ulWidth = 170;
                }
                $(this).next('ul.options').children('li').each(function() {
                    if( $(this).width() > ulWidth ) {
                        ulWidth = $(this).width();
                    }
                });
                $(this).next('ul.options').width( ulWidth );
                $(this).next('ul.options').children('li').width( ulWidth );
            });
        });
    });
});
*/

function get_parent_z_index( object ) {
    var parent = $(object).parent();
    if( parent.css("z-index") == null ) {
        if( parent == $("body") ) {
            return 0;
        } else {
            return get_parent_z_index( parent );
        }
    } else {
        return parent.css("z-index");
    }
}

var newLayoutRefreshButtons = function() {
    $( "input[type=submit],input[type=button], button" ).not(".manual").not(".ui-button").not('.advanced-button').css({"z-index": $(this).parent().zIndex() }).button();
    $( "input[type=submit].ui-button, input[type=button].ui-button, button.ui-button" ).not(".manual").not('.advanced-button').button("refresh");
};

$(document).ready(function(){
    newLayoutRefreshButtons();
});