/*
Title: cookie.js
	
Description:
Script to error provider.
	
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
*/


var Cookie = function(path, domain, secure)
{
    /*
       Variable: path
       [string] cookie path
      */
	this.path = path;
    
    /*
       Variable: domain
       [string] cookie domain
      */
	this.domain = domain;
    
    /*
       Variable: secure
       [boolean] cookie secure
      */
	this.secure = secure;
	
    /*
       Function: Set

       Function sets cookie variable.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            string 	name - name of variable.
            string 	value - value of variable.
            int 	expires - time to expire.

    */
	this.Set = function(name, value, expires)
	{
		var today = new Date();
		today.setTime( today.getTime() );
		
		if(expires) {
			expires = expires * 1000 * 60 * 60 * 24;
		}
		
		var expires_date = new Date( today.getTime() + (expires) );
		document.cookie = name + "=" +escape( value ) +
			( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
			( ( this.path ) ? ";path=" + this.path : "" ) +
			( ( this.domain ) ? ";domain=" + this.domain : "" ) +
			( ( this.secure ) ? ";secure" : "" );
	}
	
    /*
       Function: Get

       Function gets cookie variable.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            string 	name - name of variable.
    
       Returns:
    
            string - cookie value.

    */
	this.Get = function(name) 
	{
		var a_all_cookies = document.cookie.split( ';' );
		var a_temp_cookie = '';
		var cookie_name = '';
		var cookie_value = '';
		var b_cookie_found = false;
		for(var i = 0; i < a_all_cookies.length; i++) {
			a_temp_cookie = a_all_cookies[i].split( '=' );
			cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
			if(cookie_name == name) {
				b_cookie_found = true;
				if(a_temp_cookie.length > 1) {
					cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
				}
				
				return cookie_value;
				break;
			}
			
			a_temp_cookie = null;
			cookie_name = '';
		}
		
		if (!b_cookie_found) {
			return null;
		}
	}
	
    /*
       Function: Delete

       Function delete cookie variable.

       Author:
            Wojciech Matusiak <wojciech.matusiak[at]librus.pl>

       Parameters:

            string 	name - name of variable.

    */
	this.Delete = function(name) 
	{
		if(this.Get(name)) {
			document.cookie = name + "=" +
				( ( this.path ) ? ";path=" + this.path : "") +
				( ( this.domain ) ? ";domain=" + this.domain : "" ) +
				";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
	}

}
