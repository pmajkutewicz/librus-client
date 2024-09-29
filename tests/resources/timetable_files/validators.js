/*
Title: validators.js
	
Description:
Validate values.
	
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
*/

/*
Function: IsInteger

Check value as integer.
   
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
		
Parameters:

mixed value - value to check.

Returns:

boolean - true if value is integer.
*/
var IsInteger = function(value)
{
    return /^-?\d+$/.test(value);
};

/*
Function: IsDate

Check value as date.
   
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
		
Parameters:

mixed month - month (integer correct).
mixed day - day (integer correct).
mixed year - year (integer correct).

Returns:

boolean - true if value is correct date.
*/
var IsDate = function(month, day, year)
{
	if(!IsInteger(month) || !IsInteger(day) || !IsInteger(year)) {
		return false;
	}
	
	var daysInMonth = 31;
	if (month == 4 || month == 6 || month == 9 || month == 11) {
		daysInMonth = 30;
	} else if (month == 2) { 
		daysInMonth = (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
	}
	
	if (month < 1 || month > 12) {
		return false;
	}
	
	if (day < 1 || day > daysInMonth) {
		return false;
	}
	
	if (year < 1900 || year > 2100){
		return false;
	}
	
	return true;
};

/*
Function: StrIsDate

Check value from string as date.
   
Author:
Wojciech Matusiak <wojciech.matusiak[at]librus.pl>
		
Parameters:

string strDate - date ('-' seperate)

Returns:

boolean - true if value is correct date.
*/
var StrIsDate = function(strDate)
{
    var tmp = strDate.trim().split('-');
    if(tmp.length != 3) {
        tmp = strDate.trim().split('/');
        if(tmp.length != 3) {
            tmp = strDate.trim().split('.');
        }
    }

    if(tmp.length != 3) {
        return false;
    }

    return IsDate(tmp[1], tmp[2], tmp[0]);
};
