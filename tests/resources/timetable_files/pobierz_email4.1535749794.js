/*
Title: pobierz_email2.js
	
Description:
Script to save contact data.
	
Author:
Łukasz Kasztelan
*/
bezpiecznik_monitu_danych = 1;
var okno = null;

/*
   Function: wyswietl_monit_danych_kontaktowych

   Function display prompt of contact data.
   
   Author:
		Łukasz Kasztelan
		
*/

function zapiszZmianaDanych()
{
    if( (ob_mail = document.getElementById('pobierz_email'))
        && (ob_pass = document.getElementById('al_pass')) )
    {
	    var email = ob_mail.value;
        var pass = ob_pass.value;
        $.ajax({
            dataType: "json",
            type: "post",
            url: '/centrumPowiadomien/zapiszDaneKontaktowe',
            data: 'email='+email+'&pass='+pass,
            success: function(data){
                if( data["SUCCESS"] ) {
                    var buttons = ["ok"];
                    if (okno) {
                        okno.remove();
                    }
                    show_message( "information small", "Sukces", 'Poprawnie zapisano formularz.', buttons, true );
                } else {
                    var buttons = ["ok"];
                    var Errors = new ErrorProvider();
                    Errors.Clear();
                    if (data["ERRORS_PASS"]) {
                        Errors.SetError($('#al_pass'), 'Błędne hasło.');
                    } else {
                        $.each(data["ERRORS"], function( index, value ) {
                            show_message( "error small", "Błąd", value, buttons );
                        });
                    }
                }
            },
            error: function (request, status, error) {
                var buttons = ["ok"];
                show_message( "error small", "Błąd", 'Wystąpił błąd podczas zapisu.', buttons, true );
            }
        });
    }
    
}



function wyswietl_monit_danych_kontaktowych(){

    if(bezpiecznik_monitu_danych){

	    $JQmodal('#basic-modal-content').modal();
	
	bezpiecznik_monitu_danych = 0;
    }
}

/*
   Function: zapis_danych_kontaktowych

   Function check and save contact data.
   
   Author:
		Łukasz Kasztelan
		
*/
function zapis_danych_kontaktowych()
{
    if (ob_mail = document.getElementById('pobierz_email')) {
        var email = ob_mail.value;
        if (!email.match(/^[^@]+@[^@]+$/)) {
            show_message(
                'information',
                'Informacja',
                'Wprowadzono e-mail w niepoprawnym formacie. Prosimy poprawić i spróbować ponownie.',
                ['ok'],
                true
            );
            return false;
        }

        var okno_haslo = '' +
            '<table class="decorated form small center">' +
                '<thead>' +
                    '<tr>' +
                        '<td colspan="3">&nbsp;</td>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr class="line0">' +
                        '<th>Aktualne hasło</th>' +
                        '<td colspan="2">' +
                            '<input type="password" class="big pass" name="al_pass" id="al_pass"/>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
                '<tfoot>' +
                    '<tr>' +
                        '<td colspan="3">&nbsp;</td>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>';
        var buttons = [
            {
                value:'OK',
                click: function() {
                    zapiszZmianaDanych();
                }
            },
            {
                value:'Anuluj',
                close:true
            }
        ];
        okno = show_message(
            'information small',
            'Potwierdzenie zmiany danych',
            '',
            buttons,
            true
        );
        okno.find('.warning-content').html(okno_haslo);
        return false;
    }
};
