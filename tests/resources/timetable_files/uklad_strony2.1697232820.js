/*
Title: uklad_strony.js
	
Description:
General javascript functions.
	
Author:
Artur Smolarski <artur.smolarski[at]librus.pl>
*/

/*
   Function: checkRequired

   The function checks if all required fields are filled or not. 

   Author:
		Łukasz Makuch <lukasz.makuch[at]librus.pl>
		
   Parameters:

		form - the form you want to check
*/
    function checkRequired(form)
    {
        result = true;
        toCheck = form.find("input, select, textarea");
        toCheck.each(function(){
            if (
                $(this).data("required")
                && $(this).val().trim().length == 0
            )
            {
                result = false;
                return false;
            }
        });
        if(!result)
        {
            var dialog = show_message(
                'error',
                'Niekompletny formularz',
                'Musisz wypełnić wszystkie wymagane pola, aby przejść dalej',
                [{value:'OK', click:function(){ dialog.remove(); }}],
                true
            );              
        }
        return result;
    }

/*
   Function: podswietl_kolumne

   This function highlights table cell.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	cell - cell object.
		string 	id - cell identifier.
        string 	kolorGlowny - css formated color.
        string 	kolorZaznaczony - css formated color.
        string 	znacznik - name tag value.
*/
	function podswietl_kolumne(cell,id,kolorGlowny,kolorZaznaczony,znacznik)
	{		
    	var obj=document.getElementsByTagName(znacznik),i=0,s=false; //pobierz pola czeckbox
    	if (cell.id=='')
    	{
    		
    		cell.id='zazn';
    		var ii=obj.length;
    		for (i=0;i<ii;i++)
    		{
    			if (obj[i].id=='td_'+id) 
    			{
    				obj[i].style.background=kolorZaznaczony;				
    			}
    		}
    	} 
    	else 
    	{
    		
    		cell.id='';
    		var ii=obj.length;
    		for (i=0;i<ii;i++)
    		{
    			if (obj[i].id=='td_'+id) 
    			{
    				obj[i].style.background=kolorGlowny;
    			}
    		}
    	}
	}

/*
   Function: podswietl_kolumne2

   This function highlights table cell by chancing class tag.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	cell - cell object.
		string 	id - cell identifier.
        string 	klasaZaznaczona - highlighted class.
        string 	znacznik - name tag value.
*/
	function podswietl_kolumne2(cell,id,klasaZaznaczona,znacznik)
	{		
	
	var obj=document.getElementsByTagName(znacznik),i=0,s=false; //pobierz pola czeckbox	
	if (cell.id=='')
	{
		
		cell.id='zazn';
		var ii=obj.length;
		for (i=0;i<ii;i++)
		{
			if (obj[i].id=='td_'+id) 
			{				
				obj[i].className = klasaZaznaczona;
			}
		}
	} 
	else 
	{
		
		cell.id='';
		var ii=obj.length;
		for (i=0;i<ii;i++)
		{
			if (obj[i].id=='td_'+id) 
			{
				obj[i].className='';
			}
		}
	}
	}


/*
   Function: podswietl_wiersz

   This function highlights table row by chancing class tag.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	id - cell object.
		string 	stylGlowny - main class.
        string 	stylZaznaczony - highlighted class.
*/
    function podswietl_wiersz(id,stylGlowny,stylZaznaczony)
    {	
    	var row=document.getElementById('tr_'+id); //pobierz pola czeckbox
    	if (row.className==stylGlowny)
    	{
    		row.className=stylZaznaczony;
    	} 
    	else 
    	{
    		row.className=stylGlowny;
    	}
    }
	 
/*
   Function: strpos

   This function emulate PHP strpos function.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		array 	haystack - searching in array .
		string 	needle - searched string.
        int 	offset - offset.

   Returns:

      int - position of searched string.
*/
	function strpos( haystack, needle, offset){
	    var i = (haystack+'').indexOf( needle, offset ); 
	    return i===-1 ? false : i;
	}
	 
/*
   Function: select_switch

   This function changes form status.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	status - new status.
*/
	 function select_switch(status)
   {
      for (i = 0; i < document.forms[0].length; i++)
      {
         document.forms[0].elements[i].checked = status;
      }
   } 
	
/*
   Function: select_switch2

   This function changes specified form name and status.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	status - new status.
        string 	nazwa - new form name.
        string 	numer_formularza - number of form on page.
*/
function select_switch2(status, nazwa, numer_formularza)
{
    numer_formularza = typeof (numer_formularza) != 'undefined' ? numer_formularza : 0;

    for (i = 0; i < document.forms[numer_formularza].length; i++)
    {
        if (document.forms[numer_formularza].elements[i].name == nazwa)
        {
            if (document.forms[numer_formularza].elements[i].disabled == false)
            {
                element = document.forms[numer_formularza].elements[i];
                element.checked = status;
                $(element).trigger("change");
            }
        }
    }
}
/*
   Function: selectSwitchByName

   Function set checked attribute by element name.

   Author:
		Marcin Pruciak <marcin.pruciak[at]librus.pl>
		
   Parameters:

	string 	status - new status.
        string 	name - element name.
*/
function selectSwitchByName(status, name)
{
    for (i = 0; i < document.getElementsByName(name).length; i++)
    {
        if (document.getElementsByName(name)[i].disabled == false)
        {
            document.getElementsByName(name)[i].checked = status;
        }
    }
}

/*
   Function: kopiuj_wartosc

   This function set value for elements of identifiers between idOd and idDo.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	wartosc - new value.
		int 	idOd - id from.
        int 	idDo - id to.
*/
   function kopiuj_wartosc(wartosc, idOd, idDo)
   {
      for (i = idOd; i <= idDo; i++)
      {
         document.getElementById(i).value = wartosc;
      }
   }
   
/*
   Function: select_switch3

   This function set new status of element received from partial name tag.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	status - new status.
		string 	fragmentNazwy - part of name tag.
*/
   function select_switch3(status, fragmentNazwy)
   {   
    for (i = 0; i < document.forms[0].length; i++)
      {
        if(document.forms[0].elements[i].name.indexOf(fragmentNazwy) > -1)
        	{
				if(document.forms[0].elements[i].disabled==false)        	
      			{
      				document.forms[0].elements[i].checked = status;
      			}	
        	}
       }
   } 
   
/*
   Function: select_switch4

   This function set new status of elements with identifier between idOd and idDo.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	status - new status.
		string 	prefix - identifier prefix.
        string 	idOd - identifier from.
        string 	idDo - identifier to.
*/
   function select_switch4(status, prefix, idOd, idDo)
   {   
	  for (i = idOd; i <= idDo; i++)
      {
        var obj = document.getElementById(prefix+'_'+i);
        if(obj.disabled==false)
        {
        	obj.checked = status;
        }	
      }
   } 
   
/*
   Function: select_switch5

   This function set new status of element received by name and form identifier.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	status - new status.
		string 	nazwa - element name tag.
        string 	formId - form identifier.
*/
   function select_switch5(status, nazwa, formId)
   {
    for (i = 0; i < document.getElementById(formId).length; i++)
      {
        if(document.getElementById(formId).elements[i].name == nazwa)
        	{
				if(document.getElementById(formId).elements[i].disabled==false)        	
      			{
      				document.getElementById(formId).elements[i].checked = status;
      			}	
        	}
       }
   } 
   
if(!addEvent) {
    var addEvent = function(O,E,F,x)
    {
        return (x = O.addEventListener) ? x(E, F, 1) : (x = O.attachEvent) ? x('on' + E, F) : !1;
    }
}

/*
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
	 		if(a.title && !a.chmurkaDone) {
                a.chmurkaDone = true;
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
	 		if(a.title && !a.chmurkaDone) {
                a.chmurkaDone = true;
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
	 		if(a.title && !a.chmurkaDone) {
                a.chmurkaDone = true;
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
*/


/*
   Function: otworz_w_nowym_oknie

   This function opens new window.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	adres - new window address.
		string 	nazwa - new window name.
        int 	szerokosc - window width.
        int 	wysokosc - window height.
*/
function otworz_w_nowym_oknie(adres,nazwa,szerokosc,wysokosc)
{
    var fullScreen = false;
    if( isNaN(szerokosc) || szerokosc == 0 ) {
        var szerokosc = screen.width;
        fullScreen = true;
    }
    if( isNaN(wysokosc) || wysokosc == 0 ) {
        var wysokosc = screen.height;
        fullScreen = true;
    }
    okno=window.open(adres,nazwa,'width=' + szerokosc + ',height=' + wysokosc + ',resizable=yes,scrollbars');
    // for chrome in windows
    if (fullScreen) {
        okno.moveTo(0,0);
        okno.resizeTo(szerokosc, wysokosc);
    }
    
    okno.focus();
}

function otworz_w_nowym_oknie_i_wyslij_post(adres, nazwa, formData, szerokosc, wysokosc)
{
	let form = document.createElement('form');
	form.method = 'post';
	form.action = adres;
	form.target = nazwa;
	let fields = Object.keys(formData);
	let input = null;
	for (let i = 0; i < fields.length; i++)  {
		input = document.createElement("input");
		input.name = fields[i];
		input.type = "hidden";
		input.value = formData[fields[i]];
		form.appendChild(input);
	}

	document.body.appendChild(form);
	let fullScreen = false;
	if( isNaN(szerokosc) || szerokosc == 0 ) {
		let szerokosc = screen.width;
		fullScreen = true;
	}

	if( isNaN(wysokosc) || wysokosc == 0 ) {
		let wysokosc = screen.height;
		fullScreen = true;
	}

	okno = window.open(adres, nazwa,'width=' + szerokosc + ',height=' + wysokosc + ',resizable=yes,scrollbars');
	// for chrome in windows
	if (fullScreen) {
		okno.moveTo(0,0);
		okno.resizeTo(szerokosc, wysokosc);
	}

	form.submit();
	okno.focus();
}

/*
   Function: zaswiec

   This function shows elements from array tablica.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		array 	tablica - array of elements.
*/
function zaswiec(tablica){

    zmien_display(tablica, 'block');
}

/*
   Function: zgas

   This function hides elements from array tablica.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		array 	tablica - array of elements.
*/
function zgas(tablica){

    zmien_display(tablica, 'none');
}

/*
   Function: zmien_display

   This function changes css dispaly value of elements from array tablica.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		array 	tablica - array of elements.
        array 	wartosc - new dispaly value.
*/
function zmien_display(tablica, wartosc){

    var n = tablica.length;

    for(var i = 0; i<n; i++){

        if( wartosc === 'block' ) {
            if (jQuery) {
                $( "#"+tablica[i] ).show();
            } else {
                document.getElementById(tablica[i]).style.display = wartosc;
            }
        } else {
            document.getElementById(tablica[i]).style.display = wartosc;
        }
    }
}

/*
   Function: zaznacz_nb

   This function checks absences checkbox.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		array 	checkbox - checkbox elements.
        array 	prefix - element identifier prefix.
        array 	typ - type of selection.
        array 	godzin - number of hours.
*/
function zaznacz_nb(checkbox,prefix,typ,godzin)
{
	var n = new Array();
	var c = new Array();
	var sum=suma_typow_nieobecnosci+1;
	for (var i=0; i<sum; i++)
	{
		n.push(false);
		c.push(false);
	}
	var i;
	var zazn=0;
	
	if (checkbox.checked)
	{
		n[typ]=true;
	} else {
		c[typ]=true;
	}
	for (var ii=0; ii<sum; ii++)
	{
		for (var i=0; i<=godzin; i++){
			try{
				if (document.getElementById('aktywne_'+prefix+'_'+i).value==1)
				{
				document.getElementById(prefix+'_'+i+'_'+ii).checked = n[ii];
				if (n[ii]==true) {zazn++;}
				} else {
				if (n[ii]==false && typ==ii)
				document.getElementById(prefix+'_'+i+'_'+ii).checked = false;
				}
			} catch(err) {}
		}
	}
	var d=false;
	for (var ii=0; ii<sum; ii++)
		if (n[ii]==true)
			d=true;
		
	if (d==true && zazn==0)
	{
		//alert('Nie zaznaczono!\r\n\r\nW celu zbiorczego zaznaczenia pól proszę uzupełnić poszczególne lekcje.');
        show_message('information', 'Informacja', 'Nie zaznaczono!<br/>W celu zbiorczego zaznaczenia pól proszę uzupełnić poszczególne lekcje.', ['ok'], true);
		for (var ii=0; ii<sum; ii++)
		{
			document.getElementById(prefix+'_a'+ii).checked = false;
		}
	} else {
		for (var ii=0; ii<sum; ii++)
		{
			document.getElementById(prefix+'_a'+ii).checked = n[ii];
		}
	}

}

/*
   Function: zaznacz_checkbox_nb

   This function checks absences checkbox.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	obj - element object ( not used ).
        string 	kolumna - part of element identifier.
        string 	uzytkownik - part of element identifier.
        string 	zaznacz_nr - part of element identifier.
*/
function zaznacz_checkbox_nb(obj,kolumna,uzytkownik,zaznacz_nr)
{
	var num = kolumna;
	num = num.replace(/_/g, '');
	if (document.forms[0][uzytkownik+kolumna+'_'+zaznacz_nr].checked == true)
	{
		
		var c=suma_typow_nieobecnosci+1;
		for (var i=0; i<c; i++)
		{
			if (i != zaznacz_nr)
			{
				document.forms[0][uzytkownik+'_'+num][i].checked = false;
				document.forms[0][uzytkownik+'_a'+i].checked = false;
			}
		}
	} else {
		document.forms[0][uzytkownik+'_a'+zaznacz_nr].checked = false;
	}
}

/*
   Function: wlacz_wylacz_kategorie_nieobecnosci

   This function turning on and off absences category.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		bool 	wlaczony - on or off.
*/
function wlacz_wylacz_kategorie_nieobecnosci(wlaczony)
{
	
	var komorki=document.getElementsByTagName('TR');
	var l=komorki.length;
	if (wlaczony)
	{
		for (var i=0; i<l ;i++)
		{
			if (komorki[i].className=='rodzaje_nieobecnosci')
			{
				komorki[i].style.display = '';
			}
		}
	} else {
		for (var i=0; i<l ;i++)
		{
			if (komorki[i].className=='rodzaje_nieobecnosci')
			{
				komorki[i].style.display = 'none';
			}
		}
	}
}

/*
   Function: ukryj_kolumne_nb

   This function hides absences column.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	obj - object to be hided.
        bool 	numer - part of object identifier.
*/
function ukryj_kolumne_nb(obj,numer)
{
	var tab=document.getElementsByTagName('td');
	var nazwa_nb='komorka_nb_nb'+numer;
	var nazwa_u='komorka_nb_u'+numer;
	var nazwa_sp='komorka_nb_sp'+numer;
	var nazwa_zw='komorka_nb_zw'+numer;
	var nazwa_ob='komorka_nb_ob'+numer;
	var widoczny=true;
	if (obj.value=='-2') {widoczny=false;}
	var iii=tab.length;
	
	document.getElementById('zaznacz_wszystkie_ob_checkbox').checked = false;

	var tabKom=document.getElementsByName('aktywne_nb_'+numer+'[]');
	var jjj=tabKom.length;
	for (var j=0;j<jjj;j++)
	{
		if (widoczny==true)
		{
			tabKom[j].value='1';
		}
		else
		{
			tabKom[j].value='0';
		}
	}
	for (var i=0;i<iii;i++)
	{
		
		if (tab[i].id==nazwa_nb)
		{
			if (widoczny==true)
			{
				tab[i].className='no-border kolornb_nb';
				tab[i].firstChild.disabled=false;
			} else {
				tab[i].className='kolornb_wyl';
				tab[i].firstChild.disabled=true;
				tab[i].firstChild.checked=false;
			}
		}
		
		if (tab[i].id==nazwa_u)
		{
			if (widoczny==true)
			{
				tab[i].className='no-border kolornb_u';
				tab[i].firstChild.disabled=false;
			} else {
				tab[i].className='kolornb_wyl';
				tab[i].firstChild.disabled=true;
				tab[i].firstChild.checked=false;
			}
		}
		if (tab[i].id==nazwa_sp)
		{
			if (widoczny==true)
			{
				tab[i].className='no-border kolornb_sp';
				tab[i].firstChild.disabled=false;
			} else {
				tab[i].className='kolornb_wyl';
				tab[i].firstChild.disabled=true;
				tab[i].firstChild.checked=false;
			}
		}
		if (tab[i].id==nazwa_zw)
		{
			if (widoczny==true)
			{
				tab[i].className='no-border kolornb_zw';
				tab[i].firstChild.disabled=false;
			} else {
				tab[i].className='kolornb_wyl';
				tab[i].firstChild.disabled=true;
				tab[i].firstChild.checked=false;
			}
		}
		if (tab[i].id==nazwa_ob)
		{
			if (widoczny==true)
			{
				tab[i].className='no-border kolornb_ob';
				tab[i].firstChild.disabled=false;
			} else {
				tab[i].className='kolornb_wyl';
				tab[i].firstChild.disabled=true;
				tab[i].firstChild.checked=false;
			}
		}
		
		for (var trn = 0; trn<rodzaje_nieobecnosci.length; trn++)
		{
			if (tab[i].id=='komorka_nb_'+rodzaje_nieobecnosci[trn][0]+'r'+numer)
			{
				if (widoczny==true)
				{
					tab[i].className='no-border kolornb_'+rodzaje_nieobecnosci[trn][0];
					tab[i].firstChild.disabled=false;
				} else {
					tab[i].className='kolornb_wyl';
					tab[i].firstChild.disabled=true;
					tab[i].firstChild.checked=false;
				}
			}
		}
	}

	if (widoczny==true)
	{
    	var chbox=document.getElementsByTagName('input');
    	var iii2=chbox.length;
    	for (var ii=0;ii<iii2;ii++)
    	{
    		if (chbox[ii].className=='checkbox_zaznaczanie_wiersza_nb')
    		{
    			chbox[ii].checked=false;
    		}
    	}
    }
}


/*
   Function: addOption

   This function add additional option for select element.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	selectId - select element identifier.
        string 	val - new option value.
        string 	txt - new option text.
*/
function addOption(selectId, val, txt)
{
    var objOption = new Option(txt, val);
     document.getElementById(selectId).options.add(objOption);
}

/*
   Function: czy_zaznaczono_checkboxy

   This function checks is checkbocks is checked.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	nazwa - checkbox element name tag.
*/
function czy_zaznaczono_checkboxy(nazwa)
{	
	var s=false;	
  	for (i = 0; i < document.forms[0].length; i++)
    {
    	if(document.forms[0].elements[i].name == nazwa)
        {
			if(document.forms[0].elements[i].disabled==false)        	
      		{
      			if(document.forms[0].elements[i].checked)
      			{
      				s=true;
      			}
      		}	
      	}
     }
     return s;
} 

/*
   Function: zwroc_ilosc_zaznaczonych_checkboxow_po_id

   This function gets number of checked checkboxes by identifier prefix and between idOd and idDo.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	prefix - prefix identifier.
        int 	idOd - identifier from.
        int 	idDo - identifier to.

   Returns:

      int - number of checked checkboxes.
*/
function zwroc_ilosc_zaznaczonych_checkboxow_po_id(prefix,idOd,idDo)
{	
	var ilosc=0;	
	   
    for (i = idOd; i <= idDo; i++)
    {
      var obj = document.getElementById(prefix+'_'+i);
      if(obj)
      {
   	   if(obj.checked)
   		   ilosc++; 	
      }	
    }
    return ilosc;
}

/*
   Function: zwroc_ilosc_zaznaczonych_checkboxow_po_nazwie

   This function gets number of checked checkboxes by name tag prefix.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	prefix - name prefix.

   Returns:

      int - number of checked checkboxes.
*/
function zwroc_ilosc_zaznaczonych_checkboxow_po_nazwie(prefix)
{	
	var ilosc=0;	
	var obj;
	
	for (i = 0; i < document.forms[0].length; i++)    
    {                
      if(document.forms[0].elements[i].name.indexOf(prefix) > -1)
  		{    	  
    	  obj  = document.forms[0].elements[i];
    	  
    	  if(obj.checked)
      		   ilosc++; 	
  		}
      
    }
    return ilosc;
}

/*
 * Function check if field with timetable date i filled
 * @returns {Boolean}
 */
function sprawdz_wypelnienie_dat_eksport() {
    if ($('input[name="styl_planu"]:checked').val() === 'plan_normalny') {
        if ($('input[name="zak_planLekcji"]').is(':checked')) {
            if ($.trim($('input[name="data1"]').val()) === '' || $('input[name="data2"]').val() === '' || $('input[name="data3"]').val() === '') {
                show_message('warning', 'Informacja', 'Pola dat planu nie mogą być puste', ['ok'], true);
                return false;
            } else {
				let dataOrgAsString = $.trim($('input[name="data1"]').val());
				let dateAsObject = new Date(dataOrgAsString);
				let day= dateAsObject.getDate();
				day = day < 10 ? "0" + day : day;
				let month = dateAsObject.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				let year = dateAsObject.getFullYear();
				let dateAsString = `${year}-${month}-${day}`;
				if (
					dataOrgAsString.length != 10
					|| isNaN(dateAsObject)
					|| dateAsString != dataOrgAsString
				) {
					show_message('warning', 'Informacja', 'Pole "plan 1 na dzień" musi być poprawną datą.', ['ok'], true);
					return false;
				}

				dataOrgAsString = $.trim($('input[name="data2"]').val());
				dateAsObject = new Date(dataOrgAsString);
				day= dateAsObject.getDate();
				day = day < 10 ? "0" + day : day;
				month = dateAsObject.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				year = dateAsObject.getFullYear();
				 dateAsString = `${year}-${month}-${day}`;
				if (
					dataOrgAsString.length != 10
					|| isNaN(dateAsObject)
					|| dateAsString != dataOrgAsString
				) {
					show_message('warning', 'Informacja', 'Pole "plan 2 na dzień" musi być poprawną datą.', ['ok'], true);
					return false;
				}

				dataOrgAsString = $.trim($('input[name="data3"]').val());
				dateAsObject = new Date(dataOrgAsString);
				day= dateAsObject.getDate();
				day = day < 10 ? "0" + day : day;
				month = dateAsObject.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				year = dateAsObject.getFullYear();
				dateAsString = `${year}-${month}-${day}`;
				if (
					dataOrgAsString.length != 10
					|| isNaN(dateAsObject)
					|| dateAsString != dataOrgAsString
				) {
					show_message('warning', 'Informacja', 'Pole "plan 3 na dzień" musi być poprawną datą.', ['ok'], true);
					return false;
				}

                return true;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }
}

/*
   Function: zwroc_ilosc_zaznaczonych_checkboxow_po_name

   This function gets number of checked checkboxes by name tag.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	nazwa - name.

   Returns:

      int - number of checked checkboxes.
*/
function zwroc_ilosc_zaznaczonych_checkboxow_po_name(nazwa)
{	
	var ilosc=0;	
  	for (i = 0; i < document.forms[0].length; i++)
    {
    	if(document.forms[0].elements[i].name == nazwa)
        {
    		if(document.forms[0].elements[i].checked)
  			{
    			ilosc++;
  			}
      	}
     }
     return ilosc;
} 

/*
   Function: pobierzPozycjeTop

   This function gets top offset of object.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	obj - element object.

   Returns:

      int - offset top position.
*/
function pobierzPozycjeTop(obj) {
    var ntop = 0;
    if (obj.offsetParent) {
        ntop = obj.offsetTop;
        while (obj = obj.offsetParent) {
            ntop += obj.offsetTop;
        }
    }
    return ntop;
}

/*
   Function: pobierzPozycjeLeft

   This function gets left offset of object.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		object 	obj - element object.

   Returns:

      int - offset left position.
*/
function pobierzPozycjeLeft(obj) {
    var nleft = 0;
    if (obj.offsetParent) {
        nleft = obj.offsetLeft;
        while (obj = obj.offsetParent) {
            nleft += obj.offsetLeft;
        }
    }
    return nleft;
}

/*
   Function: wyswietlRamkeInformacji

   This function shows information frame.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	id - element identifier.
        string 	box - not used in this function.
*/
function wyswietlRamkeInformacji(id,box)
{
	var obj=document.getElementById(id);
	if (obj)
	{
		obj.style.display="inline";
	}
}

/*
   Function: ukryjRamkeInformacji

   This function hides information frame.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	id - element identifier.
*/
function ukryjRamkeInformacji(id)
{
	document.getElementById(id).style.display="none";
}

/*
   Function: ukryj_preloadera_html

   This function hides preloader.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
*/
function ukryj_preloadera_html()
{
	var objLoading = document.getElementById('loading_big_html');
	if(objLoading)
	{
		objLoading.style.display='none'
	}
	var objLoadingSmall = document.getElementById('loading_small_html');
	if(objLoadingSmall)
	{
		objLoadingSmall.style.display='none'
	}	
			 
}

/**
 Function: checkSubjectLength
 
 This function checks is subject out of limit.
 
 Author:
    Krzysztof Zerucha <krzysztof.zerucha[at]librus.pl>
 
 Parameters:
    int limitNum - subject limitation.
    string elemId - element id to check
 
 Returns:
 
 bool - is out of limit or not.
 */
function checkSubjectLength(limitNum, elemId)
{
    var obj = document.getElementById(elemId ? elemId : 'temat');
    if (obj.value.length > limitNum) {
        show_message(
            'error',
            'Temat wiadomości jest zbyt długi',
            'Temat wiadomości jest zbyt długi. Maksymalna długość tematu, który może zostać wysłany to '
            + limitNum + ' znaków. Czy skrócić treść tematu do ' + limitNum + ' znaków?',
            [{ value: 'OK',
               click: function(){
                    obj.value = obj.value.substring(0, limitNum);
               },
               close: true
            }, 'no']
        );
        return false;
    } else {
        return true;
    }
}

/**
 Function: sprawdz_dlugosc_wiadomosci
 
 This function checks is message out of limit.
 
 Author:
    Artur Smolarski <artur.smolarski[at]librus.pl>
 
 Parameters:
    int limitNum - message limitation.
    string elemId - element id to check
 
 Returns:
 
 bool - is out of limit or not.
 */
function sprawdz_dlugosc_wiadomosci(limitNum, elemId)
{
    var obj = document.getElementById(elemId ? elemId : 'tresc_wiadomosci');
    if (obj.value.length > limitNum) {
        show_message(
                     'error', 
                     'Treść wiadomości jest zbyt długa', 
                     'Treść wiadomości jest zbyt długa. Maksymalna długość wiadomości, która może zostać wysłana to ' + limitNum + ' znaków. Czy skrócić treść wiadomości do ' + limitNum + ' znaków?', 
                     [{ value: 'OK',
                        click: function(){
                             obj.value = obj.value.substring(0, limitNum);
                        },
                        close: true
                     }, 'no']
                    );
        return false;
    } else {
        return true;
    }
}

/*
   Function: sprawdz_czy_zaznaczono_adresata

   This function checks addressee to be filled.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>

   Returns:

      bool - is filled or not.
*/
function sprawdz_czy_zaznaczono_adresata()
{
	var czyZaznaczono = 0;
	var typ = document.getElementsByName('adresat');
	var zaznaczonyTyp = String();
	
	for(var j=0; j < typ.length; j++)
	{
	    if(typ[j].checked)
	    {
	        zaznaczonyTyp = typ[j].value;
	    }
	}

        if (zaznaczonyTyp == 'sadmin') {
		czyZaznaczono = 1;
	}   
	else
	{	
		var tab = document.getElementsByName('DoKogo[]');
		if(tab)
		{
		    for(var i=0; i < tab.length; i++)
		    {
		        if(tab[i].checked)
		        {
		            czyZaznaczono = 1;
		        }
		    }
		}
	}
	
	if(czyZaznaczono)
	{
		return true;
	}	
	else
	{
	    show_message('error', 'Nie wybrano adresatów wiadomości', 'Proszę zaznaczyć adresata(ów) wiadomości', ['ok']);
		return false;
	}	
}

/*
   Function: zdisabluj_obiekt

   This function disables object.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	identyfikator - identifier of object to be disabled.
*/
function zdisabluj_obiekt(identyfikator)
{
	var obj = document.getElementById(identyfikator);
	if(obj)
	{
		obj.disabled=true;
	}	
}

/*
   Function: zwroc_date_z_pola_wyboru

   This function gets date from date elements by their names.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		string 	prefixNazwy - data field name prefix.

   Returns:

      string - date or null.
*/
function zwroc_date_z_pola_wyboru(prefixNazwy)
{
	var dzienOb = document.getElementsByName(prefixNazwy+'dzien')[0];
	var miesiacOb = document.getElementsByName(prefixNazwy+'miesiac')[0];
	var rokOb = document.getElementsByName(prefixNazwy+'rok')[0];
	if(rokOb && miesiacOb &&  dzienOb && rokOb.value > 0 && miesiacOb.value  > 0 &&  dzienOb.value  > 0)
	{
		return rokOb.value +'-'+ miesiacOb.value +'-'+  dzienOb.value;
	}
	else
	{
		return null;
	}				

}	

/*
   Function: sprawdz_date

   This function check date to be correct.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

		int 	dzien - day of month.
        int 	miesiac - month.
        int 	rok - year.

   Returns:

      bool - correct or not.
*/
function sprawdz_date(dzien,miesiac,rok){
	var dat = new Date(parseInt(rok), (parseInt(miesiac) - 1), parseInt(dzien));
	if(dat.getFullYear() == parseInt(rok) &&  dat.getMonth() == (parseInt(miesiac) - 1) && dat.getDate() == parseInt(dzien)){
		return true;
	}
	else{
		return false;
	}			
} 

/*
   Function: ustaw_date_w_polu_wyboru

   This function sets date in date fields.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	prefixNazwy - date fields name prefix.
		int 	dzien - day of month.
        int 	miesiac - month.
        int 	rok - year.

   Returns:

      bool - success or not.
*/
function ustaw_date_w_polu_wyboru(prefixNazwy, dzien,miesiac,rok)
{
	if(sprawdz_date(dzien,miesiac,rok)){
		var dzienOb = document.getElementsByName(prefixNazwy+'dzien')[0];
		var miesiacOb = document.getElementsByName(prefixNazwy+'miesiac')[0];
		var rokOb = document.getElementsByName(prefixNazwy+'rok')[0];
		if(rokOb && miesiacOb &&  dzienOb){
			var czyUstawionoRok = false;
			var czyUstawionoMsc = false;
			var czyUstawionoDzien = false;
			var ilosc = rokOb.options.length;
			for (var i=0; i < ilosc; i++){
				if (rokOb.options[i].value == rok){
					rokOb.options[i].selected=true;
					czyUstawionoRok = true;
					break;
				}
			}
			var ilosc = miesiacOb.options.length;
			for (var i=0; i < ilosc; i++){
				if (miesiacOb.options[i].value == miesiac){
					miesiacOb.options[i].selected=true;
					czyUstawionoMsc = true;
					break;
				}
			}
			var ilosc = dzienOb.options.length;
			for (var i=0; i < ilosc; i++){
				if (dzienOb.options[i].value == dzien){
					dzienOb.options[i].selected=true;
					czyUstawionoDzien = true;
					break;
				}
			}
			
			if(czyUstawionoRok && czyUstawionoMsc && czyUstawionoDzien){
				return true;
			}else{
				return false;
			}
		}	
		
	}else{
		return false;
	}	
	
	
	if(rokOb && miesiacOb &&  dzienOb && rokOb.value > 0 && miesiacOb.value  > 0 &&  dzienOb.value  > 0)
	{
		return rokOb.value +'-'+ miesiacOb.value +'-'+  dzienOb.value;
	}
	else
	{
		return null;
	}				

}

/*
   Function: czy_poprawne_daty_w_polach_wyboru

   This function validates date in selection fields between prefixNazwyOd and prefixNazwyDo.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	prefixNazwyOd - date fields name prefix from.
        string 	prefixNazwyDo - date fields name prefix to.

   Returns:

      bool - correct or not.
*/
function czy_poprawne_daty_w_polach_wyboru(prefixNazwyOd, prefixNazwyDo)
{
	
	var dzienObOd = document.getElementsByName(prefixNazwyOd+'dzien')[0];
	var miesiacObOd = document.getElementsByName(prefixNazwyOd+'miesiac')[0];
	var rokObOd = document.getElementsByName(prefixNazwyOd+'rok')[0];

	var dzienObDo = document.getElementsByName(prefixNazwyDo+'dzien')[0];
	var miesiacObDo = document.getElementsByName(prefixNazwyDo+'miesiac')[0];
	var rokObDo = document.getElementsByName(prefixNazwyDo+'rok')[0];
	
	if(rokObOd && miesiacObOd &&  dzienObOd && rokObOd.value > 0 && miesiacObOd.value  > 0 &&  dzienObOd.value  > 0 &&  rokObDo && miesiacObDo &&  dzienObDo && rokObDo.value > 0 && miesiacObDo.value  > 0 &&  dzienObDo.value  > 0)
	{
		var dateOd = new Date(parseInt(rokObOd.value), (parseInt(miesiacObOd.value) -1), parseInt(dzienObOd.value));
		var dateDo = new Date(parseInt(rokObDo.value), (parseInt(miesiacObDo.value) - 1), parseInt(dzienObDo.value));
		if(dateOd && dateDo && sprawdz_date(dzienObOd.value,miesiacObOd.value,rokObOd.value) && sprawdz_date(dzienObDo.value,miesiacObDo.value,rokObDo.value)  && dateDo.getTime() >= dateOd.getTime() ){
			return true; 
		}
		else{
			return false;
		}				
	}
	else{
		return false;
	}				

}

/*
   Function: pokaz_ukryj_obiekt

   This function shows and hides element.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	id - element identifier.
*/
function pokaz_ukryj_obiekt(id)
{
	
	var obj=document.getElementById(id);			
	if (obj.style.display=='none')
		{obj.style.display='block';}
	else {obj.style.display='none';}
}

/*
   Function: utaw_wartosc

   This function sets element value.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	idObiektu - element identifier.
        string 	wartosc - element value.
*/
function utaw_wartosc(idObiektu, wartosc)
{
	
	var obj=document.getElementById(idObiektu);			
	if (obj)
		{		
			obj.value=wartosc;
		}
	
}

/*
   Function: check_obiekt

   This function checks element.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	idObiektu - element identifier.
*/
function check_obiekt(idObiektu)
{
	var obj=document.getElementById(idObiektu);
	
	obj.checked = true;

} 

/*
   Function: czy_obiekt_checked

   This function checks element to be checked.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	idObiektu - element identifier.

   Returns:

      bool - element is checked or not.
*/
function czy_obiekt_checked(idObiektu)
{
	var obj=document.getElementById(idObiektu);
	
	if (obj!=null)
	{
		if(obj.checked) 
		{
			return true;
		}
	}
	
	return false;
	
} 

/*
   Function: pokaz_obiekt

   This function shows element.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	id - element identifier.
        string 	displayStyle - element display style.
*/
function pokaz_obiekt(id, displayStyle)
{
	var obj=document.getElementById(id);
	
	if (obj)
	{
		if (displayStyle==null)
			{
			obj.style.display='';
			}
		else			
			obj.style.display=displayStyle;
	}
}

/*
   Function: ukryj_obiekt

   This function hides element.

   Author:
		Artur Smolarski <artur.smolarski[at]librus.pl>
		
   Parameters:

        string 	id - element identifier.
*/
function ukryj_obiekt(id)
{
	
	var obj=document.getElementById(id);
	
	if (obj)
	{
		obj.style.display='none';
	}		
}

if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}

/*
Function: przestaw_datepickera_o_dzien

Move the date in datepicker to previous or next day.

Author:
		Sylwester Wydmuch <sylwester.wydmuch[at]librus.pl>
		
Parameters:
	 string id - datepicker id	
     int 	kierunek - move direction (1 - next day, -1 previous day).
*/
function przestaw_datepickera_o_dzien(id, kierunek){
    var d1 = document.getElementById(id).value;
    var buf1 = d1.split('-');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    var d = new Date(buf1[0], buf1[1]-1, buf1[2]);
    if(kierunek == 1){
        d = new Date(d.getTime() + (24 * 3600 * 1000));
    }
    if(kierunek == -1){
        d = new Date(d.getTime() - (24 * 3600 * 1000));
    }
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //months are zero based
    var curr_year = d.getFullYear();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(curr_date < 10){
        curr_date = '0'+curr_date;
    }
    if(curr_month < 10){
        curr_month = '0'+curr_month;
    }
    document.getElementById(id).value = curr_year + "-" + curr_month + "-" + curr_date;
}

/*
Function: yellowCardAction

Fuction support yellow card element.

Author:
    Wojciech Anders <wojciech.anders[at]librus.pl>
		
Parameters:
    string action - action name	
    string element - element name
*/
var yellowCardAction = function(action, element)
{
    if (action == 'close') {
        $("#"+element).hide();
        $.ajax({
            type: "POST",
            url: '/yellowCard',
            data: {
              action:   'close',
              interfaceName: element
            },
            cache: false, 
            async: true,
            global: false
        }) 
    } else if (action == 'show') {
        $("#"+element).show();
        $.ajax({
            type: "POST",
            url: '/yellowCard',
            data: {
                action: 'show',
                interfaceName: element
            },
            cache: false, 
            async: true,
            global: false
        });        
    } else if (action == 'minimalize') {
        $("#"+element).removeClass('maximalize');
        $("#"+element).addClass('minimalize');
        $("#"+element+" .titleYellowCard").removeClass('maximalize');
        $("#"+element+" .titleYellowCard").addClass('minimalize');
        $("#"+element+" .yellowCardMinimalize").hide();
        $("#"+element+" .yellowCardMaximalize").show();
        $("#"+element+" .cardBody").hide();
        
        $.ajax({
            type: "POST",
            url: '/yellowCard',
            data: {
              action: 'minimalize',
              interfaceName: element
            },
            cache: false, 
            async: true,
            global: false
        }); 
        
    } else if (action == 'maximalize') {
        $("#"+element).removeClass('minimalize');
        $("#"+element).addClass('maximalize');
        $("#"+element+" .titleYellowCard").removeClass('minimalize');
        $("#"+element+" .titleYellowCard").addClass('maximalize');        
        
        $("#"+element+" .yellowCardMinimalize").show();
        $("#"+element+" .yellowCardMaximalize").hide();
        
        $("#"+element+" .cardBody").show();
        
        $.ajax({
            type: "POST",
            url: '/yellowCard',
            data: {
                action : 'maximalize',
                interfaceName : element
            },
            cache: false, 
            async: true,
            global: false
        });          
    }
}

/*
Function: writeTitleCard

Write title to yellow card.

Author:
    Wojciech Anders <wojciech.anders[at]librus.pl>
		
Parameters:
    string element - element name
    string text - title to write	
*/
var writeTitleCard = function(element, text)
{
    $("#"+element+" .titleYellowCard .content").html(nl2br(text));
}

/*
Function: writeTextToCard

Write text to yellow card.

Author:
    Wojciech Anders <wojciech.anders[at]librus.pl>
		
Parameters:
    string element - element name
    string text - text to write	
*/
var writeTextToCard = function(element, text)
{
    $("#"+element+" .cardBody .content").html(nl2br(text));
}



/**
 * Replace new lines with <br> tags
 * @returns string with <br> tags instead of new lines
 */
var nl2br = function(inputString)
{
    var outputString = inputString.replace(/(\r\n|\r|\n)/g, '<br>');
    return outputString;
}

/*
Function: sendSortTable

Sent commend to sort column

Author:
    Wojciech Anders <wojciech.anders[at]librus.pl>

Parameters:
    int kolumna - text to write
    int kierunek - sort way
*/
var sendSortTable = function(kolumna, kierunek)
{
    $("#sortujTabeleKolumna").val(kolumna);
    $("#sortujTabeleKierunek").val(kierunek);
    document.forms[0].submit();
}

/*
 Function: showSavedInfo

 Show notification about succefull save value in student insurance (ajax)

 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
*/
function showSavedInfo()
{
    $('#saveInformation').show();
    $('#saveInformation').fadeOut(2000);
}
