/*
Title: Utils.js
	
Description:
	Utililty function.
	
Author:
	Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
*/

/*
Function: LogujESekretariat

    Redirect to e-Sekretariat login form.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String viewName - to which view auto logon 
	
    Returns:

    	void
*/
var LogujESekretariat = function(viewName)
{
	var szerokosc = screen.width;
	var wysokosc = screen.height;	
	var okno = window.open('/SekretariatOnLine/module/SKFOldInterface/action/AutoLogon/ViewName/' + viewName, 
						   'skr', 
						   'width=' + szerokosc + ' ,height=' + wysokosc + ' ,resizable=yes, scrollbars'); 
	okno.focus();
};

/*
Variable: MESSAGE_ERROR
[int] flag what type of message - error
*/
var MESSAGE_ERROR = 1;
/*
Variable: MESSAGE_WARNING
[int] flag what type of message - warning
*/
var MESSAGE_WARNING = 2;
/*
Variable: MESSAGE_OK
[int] flag what type of message - ok
*/
var MESSAGE_OK = 3;
/*
Variable: MESSAGE_QUESTION
[int] flag what type of message - ok
*/
var MESSAGE_QUESTION = 4;

/*
Function: showMessage

    Redirect to e-Sekretariat login form.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String msg - message text
		String type - type of message
                String element - name of elemnt on which we add message
                Array buttons - list of button which will be apper on bottom of popup
                contenerType - which type of popup will be showed ('warning-box' - box else colored stripe with text)
	
    Returns:

    	void
*/
var showMessage = function(msg, type, element, buttons, contenerType)
{
    var styleClass = '';
    var title = '';
    if(type == MESSAGE_ERROR || type == 'error') {
        styleClass = 'error'; 
        title = 'Błąd'; 
    } else {
        if(type == MESSAGE_WARNING || type == 'warning') {
            styleClass = 'warning';
            title = 'Ostrzeżenie';
        } else {
            if(type == MESSAGE_QUESTION || type == 'question') {
                styleClass = 'question';
                title = 'Pytanie';
            } else {
                styleClass = 'information';
                title = 'Informacja';
            }
        }        
    }
    
    if( !element ) {
        var element  = 'messageBox';
    }
    
    var buttonToAdd = '';
    if(buttons != undefined && buttons.length > 0) {
        for(var i=0; i < buttons.length > 0; i++) {
            buttonToAdd += '<input type="button" ';                
            $.each( buttons[i], function( key, value ) {
                buttonToAdd += key + '="' + value + '" ';
            });
            buttonToAdd += '/>';
        }
        buttonToAdd += '</div></div>';
    } else {
       buttonToAdd = ''; 
    }
    
    
    if(contenerType == 'warning-box') {
        content = '<div class="warning-box ' + styleClass + ' "><div class="warning-head"><span class="warning-title">' 
                        + title + '</span><span class="warning-close">&nbsp;</span></div><div class="warning-content"><p>'
                        + msg + '</p></div><div class="warning-buttons">' + buttonToAdd + '</div></div>';
    } else {
        if(styleClass == 'error') {
            styleClass = 'red';
        } else {
            styleClass = 'green';
        }
        
        content = '<div class="container ' + styleClass + '"><div class="container-background"><p>' + msg + '</p></div></div>';
    }
    
    var mbox = document.getElementById(element);
    $('#' + element).html(content);
    window.scrollTo(0, $(mbox).offset().top - 40);
};

/*
Function: clearMessages

    Clear message.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
    Parameters:

		String element - object to clear
	
    Returns:

    	void
*/
var clearMessages = function(element)
{
    if(element == undefined || element == '') {
	var mbox = document.getElementById('messageBox');
	while(mbox.hasChildNodes()) {
		mbox.removeChild(mbox.lastChild);
	}
    } else {
	var mbox = document.getElementById(element);
	while(mbox.hasChildNodes()) {
		mbox.removeChild(mbox.lastChild);
	}
    }    
};

/*
Function: createElementWithChildNode

    Create html element with given child.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String tagName - name of parent tag    
		child - child of created tag
		className - style class name 
	
    Returns:

    	Object - created object
*/
var createElementWithChildNode = function(tagName, child, className) 
{
	var tmp = document.createElement(tagName);
	if(className) {
		tmp.className = className;
	}
	
	if(isArray(child)) {
		for(var i = 0, len = child.length; i < len; ++i) {
			tmp.appendChild(child[i]);
		}
	} else {
		tmp.appendChild(child);
	}

	return tmp;
};

/*
Function: isArray

    Check if given object is array

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object obj - checked object 
	
    Returns:

    	Boolean
*/
var isArray = function (obj) {
	return obj.constructor == Array;
};

/*
Function: changeChildsBackgroudColor

    Change child backgroud color.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String tr - parent row 
		String color - color to set
	
    Returns:

    	void
*/
var changeChildsBackgroudColor = function(tr, color) 
{
	var tmp = firstChildNonText(tr);
	if(tmp) {
		do {
			tmp.style.backgroundColor = color;
		} while(tmp = nextSiblingNonText(tmp));
	}
};

/*
Function: parseEvent

    Adapt event depend on viewer.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String viewName - to which view auto logon 
	
    Returns:

    	void
*/
var parseEvent = function(e)
{
	if(!e) {
		var e = window.event;
	}
	
	var res = new Object();
	
	if (e.target) {
		res.target = e.target;
	} else if (e.srcElement) {
		res.target = e.srcElement;
	}
	
	// defeat Safari bug
	if (res.target.nodeType == 3) {
		res.target = res.target.parentNode;
	}
	
	if (e.keyCode) {
		res.keyCode = e.keyCode;
	} else if (e.which) {
		res.keyCode = e.which;
	}
	
	if (e.which) {
		res.rightclick = (e.which == 3);
	} else if (e.button) {
		res.rightclick = (e.button == 2);
	}
	
	res.posx = 0;
	res.posy = 0;
	if (e.pageX || e.pageY) {
		res.posx = e.pageX;
		res.posy = e.pageY;
	} else if (e.clientX || e.clientY) 	{
		res.posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		res.posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	//TODO: Add other useful event properties here
	return res;
};

/*
Function: nextSiblingNonText

    Find next sibling object.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object obj - to which view auto logon 
	
    Returns:

    	Object
*/
var nextSiblingNonText = function(obj)
{
	if(obj) {
		do {
			obj = obj.nextSibling;
		} while (obj && obj.nodeType != 1);
	}
	
	return obj;
};

/*
Function: previousSiblingNonText

    Find previous sibling object.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String viewName - to which view auto logon 
	
    Returns:

    	void
*/
var previousSiblingNonText = function(obj)
{
	if(obj) {
		do {
			obj = obj.previousSibling;
		} while(obj && obj.nodeType != 1);
	}
	
	return obj;
};

/*
Function: firstChildNonText

    Find first non text child .

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object obj - object on which we search
	
    Returns:

    	Object
*/
var firstChildNonText = function(obj)
{
	if(obj) {
		obj = obj.firstChild;
		if(obj && obj.nodeType != 1) {
			obj = nextSiblingNonText(obj);
		}
	}
	
	return obj;
};

/*
Function: trim

    Trim given text.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String str - sting to trim
		String chars - which chars delete 
	
    Returns:

    	String - trimmed string
*/
var trim = function (str, chars) 
{
	return ltrim(rtrim(str, chars), chars);
};

/*
Function: ltrim

    Left side trim.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String str - sting to trim
		String chars - which chars delete
	
    Returns:

    	void
*/
var ltrim = function (str, chars) {
	if(str) {
		chars = chars || "\\s";
		return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
	} else {
		return "";
	}
};

/*
Function: rtrim

    Right side trim.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String str - sting to trim
		String chars - which chars delete 
	
    Returns:

    	void
*/
var rtrim = function (str, chars) 
{
	if(str) {
		chars = chars || "\\s";
		return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
	} else {
		return "";
	}
};

/*
Function: displayPager

    Redirect to e-Sekretariat login form.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		int pageCount - page count 
		int currentPage - current selected page 
		Function movetoFirstPage - function move to first page 
		Function moveBackPage -  function move one page back
		Function movePageNum  -  function move to selected page
		Function moveNextPage -  function move one page forward
		Function moveLastPage - function move to last page
		String paggerElementName - name of pagger element 
                int numberOfPages - numer of elements on page
                int numberAllPosition - number of all elements
	
    Returns:

    	void
*/
var displayPager = function(pageCount, currentPage, movetoFirstPage, moveBackPage, 
        movePageNum, moveNextPage, moveLastPage, paggerElementName, numberOfPages,
        numberAllPosition)
{    
	if(!paggerElementName) {
            paggerElementName = 'pagger';
	}
    
        if(!numberOfPages) {
		numberOfPages = 20;
	}
    
	
	var pagger = document.getElementById(paggerElementName);
	while(pagger.hasChildNodes()) {
		pagger.removeChild(pagger.lastChild);
	}        
        
	if(pageCount > 1) {
                var fromPosition = ((currentPage-1) * numberOfPages) + 1;
                var toPosition = ((currentPage-1) * numberOfPages) + numberOfPages;
                if(toPosition > numberAllPosition) {
                    toPosition = numberAllPosition;
                }
                
                pagger.appendChild(document.createElement('hr'));
                var span = document.createElement('span');
                span.innerHTML = 'Strona ' + currentPage + ' z ' + pageCount + '&nbsp;&nbsp;&nbsp;&nbsp;' 
                    + 'Pozycje ' + fromPosition + ' ..' + toPosition + ' z ' + numberAllPosition;
		pagger.appendChild(span);
		pagger.appendChild(document.createElement('br'));
                var linkListElement = document.createElement('ul');            
                var hrefLink = 'javascript:void(null);'
                var li = document.createElement('li');
                var a;
                
		if(currentPage != 1) {
                    a = document.createElement('a');
                    a.href = hrefLink;
                    a.onclick = movetoFirstPage;
                    a.innerHTML = '&lt;&lt;';
                    li.className = 'jump';
                    li.appendChild(a);
                    linkListElement.appendChild(li);
                    li = document.createElement('li');
                    li.className = 'jump';
                    a = document.createElement('a');
                    a.href = hrefLink;
                    a.onclick = moveBackPage;
                    a.innerHTML = '&lt;Poprzednia';
                    li.appendChild(a);
                    linkListElement.appendChild(li);
		}
		
                var classLink = '';
                
                var pierwszyNumer = Math.max(0, currentPage-5-(pageCount-currentPage <= 5 ? 5-(pageCount-1-currentPage) : 0));
                var ostatniNumer = Math.min(pageCount-1, currentPage+5+(currentPage < 5 ? 5-currentPage: 0));
                var pierwszyRekord = currentPage*numberOfPages+1;
                var ostatniRekord = pierwszyRekord+numberOfPages-1;
                if(pierwszyNumer - 1 > -1 && currentPage < (pageCount -5)) {
                    pierwszyNumer = pierwszyNumer - 1;
                    ostatniNumer = ostatniNumer - 1;
                    pierwszyRekord = pierwszyRekord - 1;
                    ostatniRekord = ostatniRekord - 1;

                    if (ostatniRekord > numberAllPosition) {
                        ostatniRekord = numberAllPosition;
                    }                    
                }
                
		for(var i = pierwszyNumer; i <= ostatniNumer; i++) {
                    if((i + 1) == currentPage) {
                        classLink = 'active';
                    } else {
                        classLink = '';
                    }
                        
                    li = document.createElement('li');
                    li.className = classLink;
                    a = document.createElement('a');
                    a.href = hrefLink;
                    a.onclick = movePageNum;
                    a.innerHTML = ((i == pierwszyNumer && pierwszyNumer > 0) || (i == ostatniNumer && ostatniNumer < pageCount-1) ? '...' : i+1);
                    li.appendChild(a);
                    linkListElement.appendChild(li);
		}
		
		if(currentPage != pageCount) {
                    li = document.createElement('li');
                    li.className = 'jump';
                    a = document.createElement('a');
                    a.href = hrefLink;
                    a.onclick = moveNextPage;
                    a.innerHTML = 'Następna&gt;';
                    li.appendChild(a);                    
                    linkListElement.appendChild(li);
                    li = document.createElement('li');
                    li.className = 'jump';
                    a = document.createElement('a');
                    a.href = hrefLink;
                    a.onclick = moveLastPage;
                    a.innerHTML = '&gt;&gt;';
                    li.appendChild(a);
                    linkListElement.appendChild(li);
		}
                
                pagger.appendChild(linkListElement);
	}
};

/*
Function: lightBox_Show

    Show lightbox object (popup) with given elements

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object content - content of lightbox 
	
    Returns:

    	void
*/
var lightBox_Show = function(content)
{
	var modlaWindow = document.getElementById('modalWindow');
	while(modlaWindow.hasChildNodes()) {
		modlaWindow.removeChild(modlaWindow.lastChild);
	}
	
	modlaWindow.appendChild(content);
	modlaWindow.style.display = document.getElementById('modalBackground').style.display = 'block';

	// special < IE7 -only processing for windowed elements, like select	
	if (window.XMLHttpRequest == null) {
		lightBox_ReplaceSelectsWithSpans();
	}

	lightBox_OnWindowResize();
	
	if (window.attachEvent) {
		window.attachEvent('onresize', lightBox_OnWindowResize);
	} else if (window.addEventListener) {
		window.addEventListener('resize', lightBox_OnWindowResize, false);
	} else {
		window.onresize = lightBox_OnWindowResize;
	}
	
	// we won't bother with using javascript in CSS to take care
	//   keeping the window centered
	if (document.all) {
		document.documentElement.onscroll = lightBox_OnWindowResize;
	}
};

/*
Function: lightBox_OnWindowResize

    Move lightbox center on page.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	void
*/
var lightBox_OnWindowResize = function() 
{		
	// we only need to move the dialog based on scroll position if
	//   we're using a browser that doesn't support position: fixed, like < IE 7
	var left = window.XMLHttpRequest == null ? document.documentElement.scrollLeft : 0;
	var top = window.XMLHttpRequest == null ? document.documentElement.scrollTop : 0;
	var div = document.getElementById('modalWindow');
	
	div.style.left = Math.max((left + (lightBox_GetWindowWidth() - div.offsetWidth) / 2), 0) + 'px';
	div.style.top = Math.max((top + (lightBox_GetWindowHeight() - div.offsetHeight) / 2), 0) + 'px';
};

/*
Function: lightBox_Close

    Close lightbox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	void
*/
var lightBox_Close = function()
{
	document.getElementById('modalWindow').style.display = document.getElementById('modalBackground').style.display = 'none';
	
	// special IE-only processing for windowed elements, like select	
	if (document.all) {
		lightBox_RemoveSelectSpans();
	}
	
	if (window.detachEvent) {
		window.detachEvent('onresize', lightBox_OnWindowResize);
	} else if (window.removeEventListener) {
		window.removeEventListener('resize', lightBox_OnWindowResize, false);
	} else {
		window.onresize = null;
	}
};

/*
Function: lightBox_RemoveSelectSpans

    Remove selected spans from lightbox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	void
*/
var lightBox_RemoveSelectSpans = function() 
{
	var selects = document.getElementsByTagName('select');
	for (var i = 0; i < selects.length; i++) {
		var select = selects[i];
		if (select.clientWidth == 0 || select.clientHeight == 0 || 
			select.nextSibling == null || select.nextSibling.className != 'selectReplacement') {
			continue;
		}
		
		select.parentNode.removeChild(select.nextSibling);
		select.style.display = select.cachedDisplay;
	}
};

/*
Function: lightBox_ReplaceSelectsWithSpans

    Replace selected spans from lightbox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	void
*/
var lightBox_ReplaceSelectsWithSpans = function()
{
	var selects = document.getElementsByTagName('select');
	for (var i = 0; i < selects.length; i++) {
		var select = selects[i];
		if (select.clientWidth == 0 || select.clientHeight == 0 || 
			select.nextSibling == null || select.nextSibling.className == 'selectReplacement') {
			continue;
		}
			
		var span = document.createElement('span');
		// this would be "- 3", but for that appears to shift the block that contains the span 
		//   one pixel down; instead we tolerate the span being 1px shorter than the select
		span.style.height = (select.clientHeight - 4) + 'px';
		span.style.width = (select.clientWidth - 6) + 'px';
		span.style.display = 'inline-block';
		span.style.border = '1px solid rgb(200, 210, 230)';
		span.style.padding = '1px 0 0 4px';
		span.style.fontFamily = 'Arial';
		span.style.fontSize = 'smaller';
		span.style.position = 'relative';
		span.style.top = '1px';
		span.className = 'selectReplacement';
		
		span.innerHTML = select.options[select.selectedIndex].innerHTML ;//+ 
			//'<img src="custom_drop.gif" alt="drop down" style="position: absolute; right: 1px; top: 1px;" />';
		
		select.cachedDisplay = select.style.display;
		select.style.display = 'none';
		select.parentNode.insertBefore(span, select.nextSibling);
	}
};

/*
Function: lightBox_GetWindowWidth

    Get width of lightbox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	int
*/
var lightBox_GetWindowWidth = function()
{
	var width = 0;
	if(typeof(window.innerWidth) == 'number') {
		width = window.innerWidth;
	} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		width = document.documentElement.clientWidth;
	} else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
		width = document.body.clientWidth;
	}

	return width;
};

/*
Function: lightBox_GetWindowHeight

    Get height of lightbox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	int
*/
var lightBox_GetWindowHeight = function()
{
    var height = 0;
    if(typeof( window.innerWidth ) == 'number') {
	    height = window.innerHeight;
    } else if( document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
	    height = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	    height = document.body.clientHeight;
	}
  		
  	return height;
};

/*
Function: wyswietlPytanie

    Show dialog message

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String tekst - message. 
		Function okCallback - when click ok.
		Function cancelCallback - when click cancel.
	
    Returns:

    	void
*/
var wyswietlPytanie = function (tekst, okCallback, cancelCallback)
{
	var div = document.createElement('div');
	var fieldset = document.createElement('fieldset');
	fieldset.className = 'RamkaKomunikatu';
	fieldset.style.margin = '5px auto';
	div.appendChild(fieldset);
	var legend = createElementWithChildNode('legend', document.createTextNode('Potwierdź'));
	fieldset.appendChild(legend);
	var divTresc = document.createElement('div');
	fieldset.appendChild(divTresc);
	divTresc.className = 'TekstKomunikatu';
	divTresc.innerHTML = tekst;
	var divPrzyciski = document.createElement('div');
	divPrzyciski.style.textAlign = 'center';
	divPrzyciski.style.marginTop = '15px';
	fieldset.appendChild(divPrzyciski);
	var buttonOk = document.createElement('input');
	buttonOk.type = 'button';
	divPrzyciski.appendChild(buttonOk);
	buttonOk.value = 'Tak';
	buttonOk.style.width = '100px';
	buttonOk.onclick = okCallback;
	divPrzyciski.appendChild(document.createTextNode(' '));
	var buttonCacnel = document.createElement('input');
	buttonCacnel.type = 'button';
	divPrzyciski.appendChild(buttonCacnel);
	buttonCacnel.value = 'Nie';
	buttonCacnel.style.width = '100px';
	buttonCacnel.onclick = cancelCallback;
	lightBox_Show(div);
};

/*
Function: selectOption

    Set selected value on combobox.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object select - combobox object
		String value - selected value
	
    Returns:

    	void
*/
var selectOption = function(select, value)
{
	select.selectedIndex = -1;
	for(var i = 0, len = select.length; i < len; ++i) {
		if(select.options[i].value == value) {
			select.selectedIndex = i;
			break;
		}
	}
};

/*
Function: getSelectValue

    Get current selected value from combobox. 

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object select - combobox object 
	
    Returns:

    	String
*/
var getSelectValue = function(select)
{
	if (select.selectedIndex < 0 || select.selectedIndex >= select.options.length) {
		return null;
	} else {
		return select.options[select.selectedIndex].value;
	}
};

/*
Function: checkDate

    Validate date.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Object datePickerInput - combobox of day
                Boolean required - if field must be set
		Object ErrorObject - combobox of month
	
    Returns:

    	void
*/
var checkDate = function(datePickerInput, required, ErrorObject)
{    
    var REQUIRED_ERROR = 'Pole wymagane.';
    var INVALID_ERROR = 'Sprawdź wprowadzoną datę.';
    if(!(datePickerInput instanceof jQuery)) {
        datePickerInput = $(datePickerInput);
    }
    
    if(required == undefined || required == false) {
       required = false; 
    } else {
       required = true; 
    }
    
    if(ErrorObject == undefined || !(ErrorObject instanceof ErrorProvider)) {
        ErrorObject = undefined;
    } else {
        ErrorObject.UnsetError(datePickerInput);
    }
    
    if(datePickerInput.val().length > 0) {
        
        if(datePickerInput.val().length != 10) {
            if(ErrorObject == undefined) {
                return false;
            } else {
                ErrorObject.SetError(datePickerInput, INVALID_ERROR);
                return false;
            }
        } else {
            var dateArray = datePickerInput.val().split('-');
            dateArray[0] = parseInt(dateArray[0], 10);
            dateArray[1] = parseInt(dateArray[1], 10) - 1;
            dateArray[2] = parseInt(dateArray[2], 10);
            var dateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
            
            if(dateObj.getFullYear() == dateArray[0] && dateObj.getMonth() == dateArray[1] && dateObj.getDate() == dateArray[2]) {
                return true;
            } else {
                ErrorObject.SetError(datePickerInput, INVALID_ERROR);
                return false;
            }
        }
        
    } else {
        if(required) {
            if(ErrorObject == undefined) {
                return false;
            } else {
                ErrorObject.SetError(datePickerInput, REQUIRED_ERROR);
            }
        } else {
            return true;
        }
    }
};

if(!addEvent) {
    var addEvent = function(O,E,F,x)
    {
        return (x = O.addEventListener) ? x(E, F, 1) : (x = O.attachEvent) ? x('on' + E, F) : !1;
    }
}

if(!chmurka) {
    var chmurka = function(doc, E, b, i, a)
    {
        doc = document;
        E = doc.documentElement;
        b = doc.body;
        if(!E) {
            return;
        }
        
        for(i = 0; a = b.getElementsByTagName("a")[i]; i++) {
            if(a.title) {
                with(a.t = doc.createElement("div")) {
                    id = "tooltip";
                    innerHTML = a.title.replace(/\|/g,"<br />");
                }
                
                a.onmouseoverOld = a.onmouseover;
                a.onmouseover = function(e) {
                    if(this.onmouseoverOld) {
                        this.onmouseoverOld(e);
                    }
                    
                    with(this){
                        title = "";
                        onmousemove(e);
                    }
                    
                    b.appendChild(this.t);
                };
                
                a.onmouseoutOld = a.onmouseout;
                a.onmouseout = function(x) {
                    if(this.onmouseoutOld){
                        this.onmouseoutOld(x);
                    }
                    
                    with(this) {
                        title = t.innerHTML.replace(/<br \/>/g,"\|");
                    }
                    
                    if(x = doc.getElementById("tooltip")) {
                        b.removeChild(x);
                    }
                };
                
                a.onmousemoveOld = a.onmousemove;
                a.onmousemove = function(e) {
                    if(this.onmousemoveOld) {
                        this.onmousemoveOld(e);
                    }
                    
                    e = e || event;
                    with(this.t.style) {
                        left =e.clientX + (E.scrollLeft || b.scrollLeft) + "px";
                        top = e.clientY + (E.scrollTop || b.scrollTop) + "px";
                    }
                };
            }
        }

        for(i = 0; a = b.getElementsByTagName("input")[i]; i++){
            if(a.title) {
                with(a.t=doc.createElement("div")) {
                    id = "tooltip";
                    innerHTML = a.title.replace(/\|/g,"<br />");
                };
                
                a.onmouseoverOld = a.onmouseover;
                a.onmouseover = function(e) {
                    if(this.onmouseoverOld){
                        this.onmouseoverOld(e);
                    }
                    
                    with(this){
                        title = "";
                        onmousemove(e);
                    }
                        
                    b.appendChild(this.t);
                };
                
                a.onmouseoutOld = a.onmouseout;
                a.onmouseout = function(x) {
                    if(this.onmouseoutOld) {
                        this.onmouseoutOld(x);
                    }
                    
                    with(this) {
                        title = t.innerHTML.replace(/<br \/>/g,"\|");
                    }
                    
                    if(x = doc.getElementById("tooltip")) {
                        b.removeChild(x);
                    }
                };
                
                a.onmousemoveOld = a.onmousemove;
                a.onmousemove = function(e) {
                    if(this.onmousemoveOld){
                        this.onmousemoveOld(e);
                    }
                    
                    e = e || event;
                    with(this.t.style) {
                        left = e.clientX + (E.scrollLeft || b.scrollLeft) + "px";
                        top = e.clientY + (E.scrollTop || b.scrollTop) + "px";
                    }
                };
            }
        }

        for(i = 0; a = b.getElementsByTagName("td")[i]; i++) {
            if(a.title) {
                with(a.t = doc.createElement("div")) {
                    id = "tooltip";
                    innerHTML = a.title.replace(/\|/g,"<br />");
                }
                
                a.onmouseoverOld = a.onmouseover;
                a.onmouseover = function(e) {
                    if(this.onmouseoverOld) {
                        this.onmouseoverOld(e);
                    }
                    
                    with(this){
                        title="";
                        onmousemove(e);
                    }
                    
                    b.appendChild(this.t);
                };
                
                a.onmouseoutOld = a.onmouseout;
                a.onmouseout = function(x) {
                    if(this.onmouseoutOld) {
                        this.onmouseoutOld(x);
                    }
                    
                    with(this) {
                        title = t.innerHTML.replace(/<br \/>/g,"\|");
                    }

                    if(x = doc.getElementById("tooltip")) {
                        b.removeChild(x);
                    }
                };
                
                a.onmousemoveOld = a.onmousemove;
                a.onmousemove = function(e) {
                    if(this.onmousemoveOld) {
                        this.onmousemoveOld(e);
                    }
                    
                    e = e || event;
                    with(this.t.style) {
                        left = e.clientX + (E.scrollLeft || b.scrollLeft) + "px";
                        top = e.clientY + (E.scrollTop || b.scrollTop) + "px";
                    }
                };
            }
        }		 
    }

    addEvent(window,'load',chmurka);
}

/*
Function: eAcessDent

    Redirect to access deny page

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation

    Returns:

    	void
*/
var eAcessDent = function()
{
	location.href = '/skr/AccessDeny';
};

/*
Function: error

    Redirect to e-Sekretariat login form.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String type - ?
		String name - file name
	
    Returns:

    	void
*/
var error = function(type, name)
{
	location.href = '/skr/Error/' + name;
};

/*
Function: deleteFromArray

    Delete element by value from array

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Array array - source array
		Mixed value - element to delete
	
    Returns:

    	Array
*/
var deleteFromArray = function(array, value)
{
	var newArray = new Array();
	
	for(var i in array) {
	    if(array[i]!=value) {
	    	newArray.push(array[i]);
	    }
	}
	
	return newArray;
}

/*
Function: getViewPortHeight

    Get height ov viewport.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Returns:

    	int
*/
var getViewPortHeight = function()
{
    if (typeof window.innerWidth != 'undefined') {
       return window.innerHeight
    } else if (typeof document.documentElement != 'undefined' && 
               typeof document.documentElement.clientWidth != 'undefined' && 
               document.documentElement.clientWidth != 0) {
       return document.documentElement.clientHeight
    } else {
       return document.getElementsByTagName('body')[0].clientHeight;
    }
};

/*
Function: SeAccessDeny

    Show access deny message.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation

    Returns:

    	void
*/
var SeAccessDeny = function()
{
	showMessage('<b>Użytkownik nie ma praw dostępu do tej funkcjonalności.</b>', MESSAGE_ERROR);
};

/*
Function: otworzWnowymOknie

    Open page in new window.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		String adres - location 
		String nazwa - name of window 
		int szerokosc - width 
		int wysokosc - height
	
    Returns:

    	void
*/
var otworzWnowymOknie = function(adres, nazwa, szerokosc, wysokosc)
{
	if(szerokosc == 0) {
		szerokosc = screen.width;
	}
	if(wysokosc == 0) {
		wysokosc = screen.height;
	}
	
	okno=window.open(adres,nazwa,'width=' + szerokosc + ' ,height=' + wysokosc + ' ,resizable=yes, scrollbars=1'); okno.focus();
        
};

/*
Function: CenterElement

    Center element. Work with element of new layout. When element have warning-content, warning-box class

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Mixed element - object to center or string with object id
	
    Returns:

    	void
*/
var CenterElement = function(element)
{
    if(jQuery.type(element) === 'string') {
        $('#' + element).find('.warning-content:first').css('maxHeight', $(window).height()*0.7 + 'px');
        $('#' + element).find('.warning-box:first').css( "top", ( ( $(window).height()/2 ) 
                - ( $('#' + element).find('.warning-box:first').height()/2 ) ) )
                .css( "left", ( ( $(window).width()/2 ) - ( $('#' + element)
                .find('.warning-box:first').width()/2 ) ) );
    } else if (element instanceof jQuery) {
        element.find('.warning-content:first').css('maxHeight', $(window).height()*0.7 + 'px');
        element.find('.warning-box:first').css( "top", ( ( $(window).height()/2 ) 
                - ( element.find('.warning-box:first').height()/2 ) ) )
                .css( "left", ( ( $(window).width()/2 ) - ( element
                .find('.warning-box:first').width()/2 ) ) );
    } else {
        $(element).find('.warning-content:first').css('maxHeight', $(window).height()*0.7 + 'px');
        $(element).find('.warning-box:first').css( "top", ( ( $(window).height()/2 ) 
                - ( $(element).find('.warning-box:first').height()/2 ) ) )
                .css( "left", ( ( $(window).width()/2 ) - ( $(element)
                .find('.warning-box:first').width()/2 ) ) );        
    }
}

/*
Function: RefreshButton

    Redraw button to set new layout look, used when button are with js added.

	Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation
	
    Parameters:

		Mixed button - object to redraw or string with object id
	
    Returns:

    	void
*/
var RefreshButton = function(button)
{
    if(jQuery.type(button) === 'string') {
        if($('#' + button).hasClass('ui-button')) {
            $('#' + button).button('refresh');
        } else {
            $('#' + button).button();
        }
    } else {
        if (button instanceof jQuery) {
            if(button.hasClass('ui-button')) {
                button.button('refresh');
            } else {
                button.button();
            }
        } else {
            if (jQuery.type(button) === 'array') {
                for(var i = 0; i < button.length; i++) {
                    RefreshButton(button[i]);
                }
            } else {
                if( $(button).hasClass('ui-button')) {
                    $(button).button('refresh');
                } else {
                    $(button).button();
                }
            }
       }
   }
}

/*
Function: ShowHelpContent

    Show help popup.

    Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl>
	
    Parameters:

		String title - title of help article

                String content - content of help article
	
    Returns:

    	void
*/
var ShowHelpPopup = function(title, content)
{
    $('#helpContent .warning-title').html(title);
    $('#helpContent .warning-content').html(content);
    $('#helpContent').fadeIn('slow').find('.warning-content').height( ( $(window).height() * 0.8 ) ); $('#helpContent').css( 'left', ( ( $(window).width() / 2 ) - ( $('#helpContent').width() / 2 ) ) ); $('#helpContent').css( 'top', ( ( $(window).height() / 2 ) - ( $('#helpContent').height() / 2 ) ) );
}

/*
Function: ShowHelpLink

    Show help popup.

    Author:
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl>
	
    Parameters:

		String idHelp - id of help article
	
    Returns:

    	void
*/
var ShowHelpLink = function(idHelp)
{
    return '<div class="container green">'
            +   '<div class="container-background">'
                + '<p>Kliknij <a onclick="xajax_GetHelpContent(\'' + idHelp + '\'); return false;" href="javascript:void(0)">tutaj</a> aby zobaczyć pomoc dla tego widoku.</p>'
        +   '</div>'
    +   '</div>'
    + '<div id="helpContent" class="warning-box information moveable large scrollable" style="display: none;">'
        + '<div class="warning-head">'
            + '<span class="warning-title"></span>'
            + '<span class="warning-close">&nbsp;</span>'
        + '</div>'
        + '<div class="warning-content"></div>'
        + '<div class="warning-buttons">'
        + '</div>'
    + '</div>';
}

/*
Function: internalMovePage

    Generate pseudo pesel to compare if something change.

	Author: 
		Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - documentation

    Parameters:

		int bornDate - date of born YYYY-MM-DD.
        int gender - gender K,M.
        int name - name.
        int surname - surname.

	Returns:
    	    	  
		mixed - string with pseudo pesel or false if something goes wrong.
*/
var generatePseudoPesel = function(bornDate, gender, name, surname)
{
    gender = gender.toUpperCase();
    name = name.toUpperCase();
    surname = surname.toUpperCase();
    bornDate = bornDate.split('-');
    bornDate = new Date(bornDate[0], (bornDate[1] - 1), bornDate[2]);
    if (bornDate.getFullYear() < 1800 || bornDate.getFullYear() > 2299) {
        return FALSE;
    }

    var pesel = Array();
    var twoDigitYear = 0;
    var twoDigitMonth = 0;
    if (bornDate.getFullYear() >= 1800 && bornDate.getFullYear() <= 1899) {
        twoDigitYear = bornDate.getFullYear() - 1800;
        twoDigitMonth = bornDate.getMonth() + 81;
    } else if (bornDate.getFullYear() >= 1900 && bornDate.getFullYear() <= 1999) {
        twoDigitYear = bornDate.getFullYear() - 1900;
        twoDigitMonth = bornDate.getMonth() + 1;
    } else if (bornDate.getFullYear() >= 2000 && bornDate.getFullYear() <= 2099) {
        twoDigitYear = bornDate.getFullYear() - 2000;
        twoDigitMonth = bornDate.getMonth() + 21;
    } else if (bornDate.getFullYear() >= 2100 && bornDate.getFullYear() <= 2199) {
        twoDigitYear = bornDate.getFullYear() - 2100;
        twoDigitMonth = bornDate.getMonth() + 41;
    } else if (bornDate.getFullYear() >= 2200 && bornDate.getFullYear() <= 2299) {
        twoDigitYear = bornDate.getFullYear() - 2200;
        twoDigitMonth = bornDate.getMonth() + 61;
    }

    var twoDigitDay = bornDate.getDate();
    if (twoDigitYear < 10) {
        twoDigitYear = '0' + twoDigitYear;
    } else {
        twoDigitYear = twoDigitYear.toString();
    }

    if (twoDigitMonth < 10) {
        twoDigitMonth = '0' + twoDigitMonth;
    } else {
        twoDigitMonth = twoDigitMonth.toString();
    }

    if (twoDigitDay < 10) {
        twoDigitDay = '0' + twoDigitDay;
    } else {
        twoDigitDay = twoDigitDay.toString();
    }

    pesel = twoDigitYear + twoDigitMonth + twoDigitDay;

    name = name.charAt(0).toUpperCase();
    name = name.charCodeAt(0);
    
    if (name < 10) {
        name = '0' + name;
    } else {
        name = name.toString();
        name = name.charAt(name.length - 2) + name.charAt(name.length - 1);
    }
    
    pesel = pesel + name;

    surname = surname.charAt(0).toUpperCase();
    surname = surname.charCodeAt(0);
    if (gender == 'M') {
        if (surname % 2 == 0) {
            surname = surname + 1;
        }
    } else {
        if (surname % 2 == 1) {
            surname = surname - 1;
        }
    }

    if (surname < 10) {
        surname = '0' + surname;
    } else {
        surname = surname.toString();
        surname = surname.charAt(surname.length - 2) + surname.charAt(surname.length - 1);
    }
    
    pesel = pesel + surname;
    
    var weight = Array(1,3,7,9,1,3,7,9,1,3);
    var controlSum = 0;
    for (var i = 0; i < 10; i++) {
        controlSum = controlSum + (pesel[i] * weight[i]);
    }

    controlSum = controlSum.toString();
    controlSum = parseInt(controlSum.charAt(controlSum.length - 1));
    controlSum = 10 - controlSum;
    controlSum = controlSum + 1;
    if(controlSum > 9) {
        controlSum = controlSum % 10;
    }

    pesel = pesel + controlSum;
    return pesel;
}

/*
Function: validatePESEL

    Validate PESEL no

    Parameters:

		String pesel - pesel to validate

	Author: 
		Artur Smolarski <artur.smolarski[at]librus.pl>

	Returns:
    	    	  
		bool
*/
function validatePESEL(pesel) {
    if (pesel.length !== 11 || pesel == '00000000000') {
        return false;
    }
    
    var stulecie = parseInt(pesel.charAt(2) + pesel.charAt(3));
    var miesiac;
    var rok;
    var dzien;

    if (stulecie < 13) {
        miesiac = stulecie.toString();
        rok = '19' + pesel.charAt(0) + pesel.charAt(1);
        dzien = pesel.charAt(4) + pesel.charAt(5);
    } else if(stulecie < 33) {
        miesiac = (stulecie - 20).toString();
        rok = '20' + pesel.charAt(0) + pesel.charAt(1);
        dzien = pesel.charAt(4) + pesel.charAt(5);
    } else if(stulecie < 53) {
        miesiac = (stulecie - 40).toString();
        rok = '21' + pesel.charAt(0) + pesel.charAt(1);
        dzien = pesel.charAt(4) + pesel.charAt(5);
    } else if(stulecie < 73) {
        miesiac = (stulecie - 60).toString();
        rok = '22' + pesel.charAt(0) + pesel.charAt(1);
        dzien = pesel.charAt(4) + pesel.charAt(5);
    } else if(stulecie < 93) {
        miesiac = (stulecie - 80).toString();
        rok = '18' + pesel.charAt(0) + pesel.charAt(1);
        dzien = pesel.charAt(4) + pesel.charAt(5);
    }

    if (parseInt(miesiac) < 10) {
        miesiac = '0' + miesiac;
    }

    if (parseInt(miesiac) > 0 && parseInt(miesiac) <= 12 && parseInt(rok) > 1799 
            && parseInt(rok) < 2299 && parseInt(dzien) > 0 && parseInt(dzien) < 32) {
    } else {
        return false;
    }
    
    //PESEL	12345567896
    //PESEL 1 	2 	3 	4 	5 	5 	6 	7 	8 	9		6
    //WAGI	1 	3 	7 	9 	1 	3 	7 	9 	1 	3
    //WYNIK 1 	6 	21  36  5   15  42  63  8   27		224
    // 10 - 4 = 6
    // 6==6 OK
    //dodatkowe info
    // 10 - 0 = 0 a nie 10 dla sumy kontrolnej
    if (IsNumeric(pesel) && (pesel.length === 11)){
        var $suma = 0;
        
        $suma = parseInt(pesel.charAt(0)) + 3 * parseInt(pesel.charAt(1)) + 7 * parseInt(pesel.charAt(2)) + 9 * parseInt(pesel.charAt(3)) + parseInt(pesel.charAt(4)) +
                3 * parseInt(pesel.charAt(5)) + 7 * parseInt(pesel.charAt(6)) + 9 * parseInt(pesel.charAt(7)) + parseInt(pesel.charAt(8)) + 3 * parseInt(pesel.charAt(9));
        $suma = String($suma);
        $suma = 10 - parseInt($suma.charAt($suma.length - 1));
        $suma = String($suma);
        $suma = $suma.charAt($suma.length - 1);

        if ($suma != parseInt(pesel.charAt(pesel.length - 1))) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

/*
Function: IsNumeric

    Validate input is numeric

	Author: 
		Artur Smolarski <artur.smolarski[at]librus.pl>

	Returns:
    	    	  
		bool
*/
function IsNumeric(n, float)
    {
        var n2 = n;
        if (float) {
            n = parseFloat(n);
        } else {
            n = parseInt(n);
        }
        return ( n!='NaN' && n2==n );
    }

