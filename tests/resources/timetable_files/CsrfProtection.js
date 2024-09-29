var CSRF_PROTECTION = (function(self) {
        
    var startAddingCsrfTokenTo = function (jQuery, tokenHeaderName, tokenHeaderValue) {
        jQuery.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader(tokenHeaderName, tokenHeaderValue);
            }
        });
    };
    self.startAddingCsrfTokenTo = startAddingCsrfTokenTo;
    
    return self;
}(CSRF_PROTECTION || {}));