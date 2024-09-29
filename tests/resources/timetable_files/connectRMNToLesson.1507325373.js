/*
 Title: connectRMNToLesson.js
 
 Description:
 Scripts support connect RMN to lesson (ex. from "Centrum Powiadomień")
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 */


/*
 * Block send question to search RMN
 * @type boolean
 */
var blockQuestionSending = false;

/*
 * Is lessons list loaded?
 * @type boolean
 */
var lessonsListLoaded  = false;

/*
 Function: showDlaczego
 
 Show arguments
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 */
var showDlaczego = function()
{
    otworz_w_nowym_oknie('/connectRMNToLesson/argumenty', 'argumenty', 900, 420);
}

/*
 Function: connectRozklad
 
 Open window connecting RMN with lesson
 
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 */
var connectRozklad = function(lessonId, virtualClass)
{
    if (virtualClass) {
        lessonId = 'w' + lessonId;
    }
    otworz_w_nowym_oknie('/connectRMNToLesson/' + lessonId, 'connectRMNToLesson', 800, 800);
}

/*
 Function: szukajRozladow
 
 Search RMN
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 
 void
 
 Returns:
 
 void
 */
var szukajRozladow = function()
{
    var subjectId = $('#subjectId').val();
    var publisherId = $('#publisher').val();
    var szukaj = $('#szukaj').val();
    var poziom = $('#poziom').val();
    var etap = $('#etap').val();
    if (blockQuestionSending) {
        return;
    }

    $("#wydawcaId").val(publisherId);
    blockQuestionSending = true;
    $('#searchRMNButton').prop('disabled', 'disabled');
    $('#searchRMNButton').button('refresh');
    $.ajax({
        type: "POST",
        url: '/connectRMNToLesson',
        data: {
            action: 'searchRMN',
            subjectId: subjectId,
            publisherId: publisherId,
            szukaj: szukaj,
            poziom: poziom,
            etap: etap
        },
        success: function(response) {
            $("#rozkladyWyniki").html(response);
        },
        error: function() {
        }
    });

    setTimeout("\
     blockQuestionSending = false;\
     $('#searchRMNButton').prop('disabled', '');\
     $('#searchRMNButton').button('refresh');\
    "
    , 3000
    );
}

/*
 Function: showRMNPreview
 
 Show RMN preview window
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 
 int rmnId - RMN Id
 
 Returns:
 
 void
 */
var showRMNPreview = function(rmnId)
{
    var url = '/edytor_rozkladu_materialu_nauczania/podglad/win/pub/rmn' + rmnId;
    otworz_w_nowym_oknie(url, 'rmnPreview', 1000, 900);
}

/*
 Function: wybierzRozklad
 
 Select RMN
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 
 int rmnId - RMN Id
 int public - if public = 1 then use publicated RMN else use private teachers RMN
 
 Returns:
 
 void
 */
var wybierzRozklad = function(rmnId, public)
{
    if ((public == 0) && ($("#mojeRozkladyLista").val() == '') || ($("#mojeRozkladyLista").val() == null)) {
        // zabezpieczenie przed brakiem wybrania rozkladu
        return;
    }

    var lessonId = $("[name='przydzial']:checked").val();
    var virtualLessonId = $("#wirtualnyPrzydzial").val();
    if (!(lessonId > 0) && !(virtualLessonId > 0)) {
        lessonId = $("#lessonId").val();
    }

    // sprawdzanie czy dopuscic do kroku 3:
    if (public == 0 && virtualLessonId > 0) {
        //przy lokalnych rokladach dla klas wirtulnych:
        if (!rmnId) {
            rmnId = $("#mojeRozkladyLista").val();
        }
        var numberTopics = $('#topics_' + rmnId).val();
        if (numberTopics == "0") {
            // gdy liczba tematow jest = 0 
            var dialog = show_message('error', 'Błąd', 'Nie można przypisać rozkładu do klas wirtualnych, ponieważ nie zawiera on tematów.',
                [{
                    value: 'OK',
                    click: function() {
                        dialog.remove();
                        return false;
                    }
                }], true
            ); 
            return;
        }
    }
    goToStep(3);
    
    if (virtualLessonId > 0) {
        lessonId = null;
    }
    if (public == 0) {
        if (!rmnId) {
            rmnId = $("#mojeRozkladyLista").val();
        }
        if (lessonId > 0) {
            // lokalne rozklady dla zwyklych klas
            $.ajax({
                type: "POST",
                url: '/connectRMNToLesson',
                data: {
                    action: 'doConnect',
                    rmnId: rmnId,
                    lessonId: lessonId,
                    virtualLessonId: virtualLessonId
                },
                success: function(response) {
                    $("#afterConnect").html(response);
                    disableStep(1);
                    disableStep(2);
                    opener.location.reload();
                }
            });
        } else {
            // lokalne rozklady dla wirtualnych klas:
            $.ajax({
                type: "POST",
                url: '/connectRMNToLesson',
                data: {
                    action: 'selectLevelForVirtual',
                    rmnId: rmnId,
                    lessonId: lessonId,
                    virtualLessonId: virtualLessonId
                },
                success: function(response) {
                    $("#afterConnect").html(response);
                    disableStep(1);
                    disableStep(2);
                }
            });        
        }
        
    } else {
        turn_preloader_on();
        //public == 1  - kopiowaniu z rozkladow publicznych
        var text = '<span id="copyInProgres">Prosimy o chwilę cierpliwości...</span>';
        $("#afterConnect").html(text);
        if (lessonId > 0) {
            // rozklady globalne dla zwyklych klas
            $.ajax({
                type: "POST",
                url: '/connectRMNToLesson',
                data: {
                    action: 'copyAndDoConnect',
                    publicRmnId: rmnId,
                    lessonId: lessonId,
                    virtualLessonId: virtualLessonId
                },
                success: function(response) {
                    $("#afterConnect").html(response);
                    disableStep(1);
                    disableStep(2);
                    turn_preloader_off();
                    opener.location.reload();
                },
                error: function() {
                    turn_preloader_off();
                    alert('Błąd komunikacji (0002)');
                }
            });
        } else {
            // rozklady globalne  dla wirtualnych klas:
            $.ajax({
                type: "POST",
                url: '/connectRMNToLesson',
                data: {
                    action: 'copyVirtualAndSelectLevel',
                    publicRmnId: rmnId,
                    virtualLessonId: virtualLessonId
                },
                success: function(response) {
                    $("#afterConnect").html(response);
                    disableStep(1);
                    disableStep(2);
                    turn_preloader_off();
                },
                error: function() {
                    turn_preloader_off();
                    alert('Błąd komunikacji (0003)');
                }
            });            
        }
    }
}

/*
 Function: listaLekcjiDoPrzypisania
 
 Get lesson list to connect with RMN
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 int lessonId - Lesson Id
 int virtualClassId - virtual classId
 
 Returns:
 void
 */
var listaLekcjiDoPrzypisania = function(lessonId, virtualClassId)
{
    if (lessonsListLoaded) {
        // nie odswiezaj listy
        return;
    }

    $.ajax({
        type: "POST",
        url: '/connectRMNToLesson',
        data: {
            action: 'listaLekcjiDoPrzypisania',
            lessonId: lessonId,
            virtualClassId: virtualClassId
        },
        success: function(response) {
            $("#listaLekcjiDoPrzypisania").html(response);
            lessonsListLoaded = true;
        },
        error: function() {
            ;
        }
    });
}

/*
 Function: changeRMNSource
 
 Change RMN source (private or public)
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 string source - 'mojeRozklady' if select private RMN else click
 
 Returns:
 void
 */
var changeRMNSource = function(source)
{
    //source - 0 - wybiera z rozkladow lokalnych
    //source - 1 - wybieraj z rozkladow globalnych
    if (source == 'mojeRozklady') {
        $('.sourceFromLocal').removeAttr('disabled');
        $('.sourceFromGlobal').attr('disabled', 'disabled');
    } else { // oficjalneRozklady
        $('.sourceFromLocal').attr('disabled', 'disabled');
        $('.sourceFromGlobal').removeAttr('disabled');
    }
    $('#searchRMNButton').button();
    $('#searchRMNButton').button('refresh');
    $('#selectFromLocalButton').button();
    $('#selectFromLocalButton').button('refresh');

    $('.sourceFromLocal[type="button"]').button('refresh');
    $('.sourceFromGlobal[type="button"]').button('refresh');
}

/*
 Function: clickPrzydzial
 
 Change RMN source (private or public)
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 string description - 'mojeRozklady' if select private RMN else click
 string wirtualny - 1 if select virtual lesson
 
 Returns:
 void
 */
var clickPrzydzial = function(lessonId, virtualClassId)
{
    if (lessonId > 0) {
        window.location = '/connectRMNToLesson/' + lessonId;
    } else {
        window.location = '/connectRMNToLesson/w' + virtualClassId;
    }
}

/*
 Function: closeWindow
 
 Close window
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 void
 
 Returns:
 void
 */
var closeWindow = function()
{
    window.close();
}

/*
 Function: nextAssign
 
 Click button 'assign next lesson'
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 void
 
 Returns:
 void
 */
var nextAssign = function()
{
    lessonsListLoaded = false;
    listaLekcjiDoPrzypisania();
    goToStep(1);
    disableStep(2);
    disableStep(3);
    $("#progressbar").html('');
}

/*
 Click button 'assign next lesson'
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 void
 
 Returns:
 void
 */
var assignNextLesson = function()
{
    var url = window.location.pathname;
    if ((url.indexOf("connectRMNToLesson") < 0) && (url.indexOf("przydzialy_rozklady") < 0)) {
        // jezeli funkcje pliku .js uzywane sa w innych miejscach niz
        // w oknie 'Przydzielenie rozkladu do lekcji' (Nauczyciel)
        // lub 'Aktualne przydziały i rozkłady' (Dyrektor/Admin)
        // to wyjdz
        return; 
    }
    $("input[type='button']").button();

    var lessonId = $("#lessonId").val();
    var virtualClassId = $("#virtualClassId").val();
    listaLekcjiDoPrzypisania(lessonId, virtualClassId);
    $('.sourceType').change(
            function() {
                if ($("#oficjalneRozklady").is(':checked')) {
                    changeRMNSource('oficjalneRozklady');
                } else {
                    changeRMNSource('mojeRozklady');
                }
            }
    );

    $('#selectTeacher').change(
            function() {
                //var selectTeacher = $('#selectTeacher').val();
                $('#selectTeacherForm').submit();
            }
    );

    $('#sendReminderButton').click(
            function() {
                $('#sendReminderForm').submit();
            }
    );
    if ($(".connectRMNToLesson").length > 0) {
        // tylko dla popu z paskiem postepu
        disableStep(2);
        disableStep(3);
        enableStep(1);
    }
    
    $("#szukaj").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
           szukajRozladow();
           return false;
        } else {
            return true;
        }
    });
    
};

/*
 Function: goToStep
 
 Go to step
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 string step - step number
 
 Returns:
 void
 */
var goToStep = function(step)
{
    var tabName = '#tabs' + step;
    var stepName = '.steps' + step;
    $("#tabs .tabItem").hide();
    $(tabName).show();
    $(".item").removeClass("current");
    $(stepName).addClass("current");
    $(stepName).addClass("done");
    enableStep(step);
    if (step != 2) {
        $("#searchRMNResults").hide();
    }
}

/*
 Function: disableStep
 
 Set step as disabled
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 string step - step number
 
 Returns:
 void
 */
var disableStep = function(step)
{
    var stepName = '.steps' + step;
    var tabName = '#tabs' + step;
    $(tabName).hide();
    var stepNameA = stepName + ' a';
    $(stepName).removeClass("done");
    $(stepName).removeClass("current");
    if ($(stepNameA).text() != '') {
        $(stepName).html($(stepNameA).text() + '<div class="bar"></div>')
    }
}

/*
 Function: enableStep
 
 Set step as enabled
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 string step - step number
 
 Returns:
 void
 */
var enableStep = function(step)
{
    var stepName = '.steps' + step;
    $(stepName).addClass("done");
    var htmlLink = '<a href="javascript:void(0);"  onclick="goToStep(' + step + ');">' + stepA[step] + '</a><div class="bar"></div>';
    $(stepName).html(htmlLink);
}

/*
 Function: selectRMNLevel
 
Select education level for virtual class in step 3
 
 Author:
 Wojciech Anders <wojciech.anders[at]librus.pl>
 
 Parameters:
 void
 
 Returns:
 void
 */
var selectRMNLevel = function()
{
    var RMNLevel = $("#RMNLevel").val(); 
    var wasCopy = $("#wasCopy").val(); 
    if (!RMNLevel > 0) {
    var dialog = show_message('error', 'Błąd', 'Poziom nie został wybrany ',
        [{
            value: 'OK',
            click: function() {
                dialog.remove();
                return false;
            }
        }], true
        );        
    } else {
        var virtualLessonId = $("#virtualClassId").val();
        var rmnId = $("#rmnId").val();
        $.ajax({
            type: "POST",
            url: '/connectRMNToLesson',
            data: {
                action: 'connectRMNToVirtualDo',
                virtualLessonId: virtualLessonId,
                rmnId: rmnId,
                RMNLevel: RMNLevel,
                wasCopy : wasCopy
            },
            success: function(response) {
                $("#afterConnect").html(response);
                opener.location.reload();
            },
            error: function() {
            }
        });
    }
}
