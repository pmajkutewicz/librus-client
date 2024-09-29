/*
Title: ErrorProvider.js
	
Description:
Script to error provider.
	
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
*/

$(function() {
    $("<style type='text/css'> .ErrorProvider_FormError{ background-color: #faa; } </style>").appendTo("head");
});

var ErrorProvider = function()
{
    /*
       Function: _ErrorElement

       Function push error message to array.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            object 	control - HTML element.
            string 	msg - error message.

    */
    var _ErrorElement = function(control, msg)
    {
        this.Control = control;
        this.Messages = new Array();
        this.Messages.push(msg);
    };

    /*
       Variable: _errors
       [array] table of errors
      */
    var _errors = new Array();

    /*
       Function: _getErrorMessageForControl

       Function returns error message.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            object 	control - HTML element.
    
       Returns:
    
            string - error message.

    */
    var _getErrorMessageForControl = function(control)
    {
        if(control instanceof jQuery) {
            control = control[0];
        }

        for(var i = 0; i < _errors.length; ++i) {
            if(_errors[i].Control[0] == control) {
                return _errors[i].Messages.join('<br />');
            }
        }

        return '';
    };

    /*
       Function: Clear

       Function clear table of errors.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

    */
    this.Clear = function()
    {
        for(var i = 0; i < _errors.length; ++i) {
            _errors[i].Control.removeClass('ErrorProvider_FormError');
            _errors[i].Control[0]._tippy.destroy();
        }

        _errors = new Array();
    };

    /*
       Function: SetError

       Function sets error message.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            object 	control - HTML element.
            string 	msg - error message.

    */
    this.SetError = function(control, message)
    {
        if(!(control instanceof jQuery)) {
            control = $(control);
        }

        for(var i = 0; i < _errors.length; ++i) {
            if(_errors[i].Control[0] == control[0]) {
                if(_errors[i].Messages.indexOf(message) == -1) {
                    _errors[i].Messages.push(message);
                }

                const newTooltipContent = _getErrorMessageForControl(control[0]);
                control[0]._tippy.setContent(newTooltipContent);
                return;
            }
        }

        var tmp = new _ErrorElement(control, message);
        tmp.Control.addClass('ErrorProvider_FormError');
        _errors.push(tmp);

        // Set up a new tippy instance
        const newTooltipContent = _getErrorMessageForControl(control[0]);
        tippy(tmp.Control[0], {
            content: newTooltipContent,
            placement: 'right',
            theme: 'librus-error',
            allowHTML: true,
            zIndex: 100000
        });
    };

    /*
       Function: UnsetError

       Function unsets error message.

       Author:
            Mateusz Dybalski <mateusz.dybalski[at]librus.pl>

       Parameters:

            object 	control - HTML element.
            string 	msg - error message.

    */
    this.UnsetError = function(control)
    {
        if(!(control instanceof jQuery)) {
            control = $(control);
        }

        for(var i = 0; i < _errors.length; ++i) {
            if(_errors[i].Control[0] == control[0]) {
                _errors.splice(i,1);
                control.removeClass('ErrorProvider_FormError');
                control[0]._tippy.destroy();
                return;
            }
        }
    };

    /*
       Function: HasErrors

       Function checks for errors in array.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
    
       Returns:
    
            int - errors length.

    */
    this.HasErrors = function()
    {
        return _errors.length != 0;
    };

    /*
       Function: GetUniqueErrorsArray

       Function creates array with unique errors.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
    
       Returns:
    
            array - table of unique errors.

    */
    this.GetUniqueErrorsArray = function()
    {
        var res = new Array();
        for(var i = 0; i < _errors.length; ++i) {
            for(var j = 0; j < _errors[i].Messages[j]; ++j) {
                if(res.indexOf(_errors[i].Messages[j]) == -1) {
                    res.push(_errors[i].Messages[j]);
                }
            }
        }

        return res;
    };
};
