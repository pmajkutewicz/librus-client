$(document).ready(function() {
    $(document.body).on("dialogcreate", "div.ui-dialog", function(event, ui) {
        $(this).removeClass('ui-corner-all');
        $(this).find('div.ui-dialog-titlebar').removeClass('ui-corner-all ui-widget-header');
        $(this).find('a.ui-dialog-titlebar-close').removeClass('ui-corner-all');
        $(this).addClass('ui-dialog-custom');
    });
});
