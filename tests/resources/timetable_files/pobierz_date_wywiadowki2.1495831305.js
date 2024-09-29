/*
Title: pobierz_date_wywiadowki1.js
	
Description:
Get parent teacher conference date.
	
Author:
Łukasz Kasztelan <lukasz.kasztelan[at]librus.pl>  
*/

/*
   Variable: bezpiecznik_wywiadowek
   [int] if variable equal then show prompt
  */
bezpiecznik_wywiadowek = 1;

/*
Function: pokaz_monit_wywiadowek

Show parent teacher conference prompt.

Author:
Łukasz Kasztelan <lukasz.kasztelan[at]librus.pl>  

*/
function pokaz_monit_wywiadowek(){
    if(bezpiecznik_wywiadowek){
        $(document).ready(function($){
            //$('.warning-box').modal();
            //$( "#data_wywiadowki" ).datepicker();
        });
        bezpiecznik_wywiadowek = 0;
    }
}

/*
Function: przeslij_date_wywiadowki

Sent parent teacher conference date.

Author:
Łukasz Kasztelan <lukasz.kasztelan[at]librus.pl>  

*/
function przeslij_date_wywiadowki(){

    var kid = document.getElementById('id_klasy_wywiadowki').value;
    var nazwa = document.getElementById('nazwa_wywiadowki').value;
    var data = document.getElementById('data_wywiadowki').value;
    var godzina = document.getElementById('godzina_wywiadowki').value;
    var minuta = document.getElementById('minuta_wywiadowki').value;
    var typeOfClassroom = $("input[name='typeOfClassroom']:checked").val();
    var classroomText = $('#classroomText').val();
    var classroomId = $('#classroomId').val();
    var tematyka = document.getElementById('tematyka_wywiadowki').value;

    $.ajax({
        dataType: "json",
        type: "post",
        url: '/centrumPowiadomien/zapiszDateWywiadowki',
        data: {
            classId: kid,
            nameOfParentTeacherConference: nazwa,
            dateOfParentTeacherConference: data,
            hour: godzina,
            minutes: minuta,
            typeOfClassroom: typeOfClassroom,
            classroomText: classroomText,
            classroomId: classroomId,
            topic: tematyka
        },
        success: function(data){
            if ( data["SUCCESS"] ) {
                var buttons = ["ok"];
                show_message("information small", "Sukces", 'Poprawnie zapisano formularz.', buttons, true);
            } else {
                var buttons = ["ok"];
                $.each(data["ERRORS"], function(index, value) {
                    show_message("error small", "Błąd", value, buttons, true);
                });
            }
        },
        error: function (request, status, error) {
            var buttons = ["ok"];
            show_message("error small", "Błąd", 'Wystąpił błąd podczas zapisu.', buttons, true);
        }
    });
   
}
