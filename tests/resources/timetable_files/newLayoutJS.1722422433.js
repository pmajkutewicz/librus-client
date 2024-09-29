function turn_preloader_on() {
  if ($("#preloader-box").hasClass("hidden")) {
    $("#preloader-box").removeClass("hidden");
  }
  $("#preloader-box").css("display", "block");
  $("#preloader-curtain").css("opacity", 0.5);
  $("#preloader").css(
    "left",
    $(window).width() / 2 - $("#preloader").width() / 2,
  );
  $("#preloader").css(
    "top",
    $(window).height() / 2 - $("#preloader").height() / 2,
  );
}

function turn_preloader_off() {
  if (!$("#preloader-box").hasClass("hidden")) {
    $("#preloader-box").addClass("hidden");
  }
  $("#preloader-box").css("display", "none");
}

function reset_graphic_menu() {
  if (resetGraphicMenu) {
    var ulWidth = 0;
    $("#graphic-menu ul li a").each(function () {
      if ($(this).css("display") != "none") {
        ulWidth += $(this).width();
      }
    });
    $("#graphic-menu").width(ulWidth + 5);
    $("#graphic-menu ul").width(ulWidth + 5);
  }
  $("#graphic-menu").show("fast");
  $("#graphic-menu").css("visibility", "visible");
}

function show_message(classes, title, message, buttons, modal) {
  var modalBox;
  var focused = false;
  var focusThisButton;
  if (modal) {
    modalBox = $(document.createElement("div"));
    modalBox.addClass("modal-box");
    var modalBackground = $(document.createElement("div"));
    modalBackground.addClass("modal-box-background");
    modalBox.append(modalBackground);
  }

  var warningBox = $(document.createElement("div"));
  var API = { box: warningBox };
  warningBox.data("show_message_api", API);
  API.center = function () {
    var API = this;
    API.box.css("top", $(window).height() / 2 - warningBox.height() / 2);
    API.box.css("left", $(window).width() / 2 - warningBox.width() / 2);
    return API;
  };

  API.setSize = function (size) {
    API.box.removeClass("small").removeClass("medium").removeClass("stretch");
    API.box.addClass(size);
    return API;
  };

  API.close = function () {
    if (modal) {
      modalBox.remove();
    }
    warningBox.remove();
  };

  warningBox.addClass("warning-box");
  warningBox.addClass("draggable");
  warningBox.addClass("scrollable");
  if (classes != "") {
    warningBox.addClass(classes);
  }

  var warningHead = $(document.createElement("div"));
  warningHead.addClass("warning-head");
  warningBox.append(warningHead);
  var warningTitle = $(document.createElement("span"));
  warningTitle.addClass("warning-title");
  warningTitle.html(title);
  warningHead.append(warningTitle);

  var warningClose = $(document.createElement("span"));
  warningClose.addClass("warning-close");
  warningClose.html("&nbsp;");
  warningClose.click(function () {
    $(this).parent().parent().css("display", "none");
    if (modal) {
      $(this).parent().parent().parent().remove();
    }
  });
  warningHead.append(warningClose);

  var warningContent = $(document.createElement("div"));
  warningContent.addClass("warning-content");
  warningContent.css("maxHeight", $(window).height() * 0.8 + "px");
  warningBox.append(warningContent);
  if (message instanceof jQuery) {
    warningContent.append(message);
  } else {
    var warningContentP = $(document.createElement("p"));
    warningContentP.html(message);
    warningContent.append(warningContentP);
  }

  var warningButtons = $(document.createElement("div"));
  warningButtons.addClass("warning-buttons");

  var buttonsObj = buttons;
  if (typeof buttons == "string") {
    buttonsObj = JSON.parse(buttons);
  }

  if (buttons != undefined && buttonsObj.length > 0) {
    $(buttonsObj).each(function (index) {
      if (typeof buttonsObj[index] == "string") {
        switch (buttonsObj[index]) {
          case "ok":
            buttonsObj[index] = {
              value: "OK",
              click: function () {
                API.close();
              },
            };
            break;
          case "no":
            buttonsObj[index] = {
              value: "Nie",
              click: function () {
                API.close();
              },
            };
            break;
        }
      }
      var button = $(document.createElement("input"));
      button.attr("type", "button");
      button.addClass(
        buttonsObj[index]["size"] == undefined
          ? "small"
          : buttonsObj[index]["size"],
      );
      button.val(buttonsObj[index]["value"]);
      if (buttonsObj[index]["click"] != undefined) {
        if (typeof buttonsObj[index]["click"] == "function") {
          button.click(buttonsObj[index]["click"]);
        } else {
          button.click(function () {
            eval(buttonsObj[index]["click"]);
          });
        }
      }
      if (buttonsObj[index]["close"] != undefined) {
        button.bind("click.close", function () {
          API.close();
        });
      }

      if (buttonsObj[index]["disabled"] !== undefined) {
        button.prop("disabled", true);
      }

      if (buttonsObj[index]["class"] !== undefined) {
        button.addClass(buttonsObj[index]["class"]);
      }

      button.button();
      warningButtons.append(button);
      if (buttonsObj[index]["focus"] != undefined) {
        focused = true;
        focusThisButton = button;
      }
    });
  }

  warningBox.append(warningButtons);

  if (modal) {
    modalBox.append(warningBox);
    modalBox.data("show_message_api", API);
    warningBox.data("modal", modalBox);
    $("body").append(modalBox);
  } else {
    $("body").append(warningBox);
  }

  warningBox.draggable({ handle: warningTitle });
  API.center();
  if (focused) {
    focusThisButton.focus();
  } else {
    warningBox.find("input,select,textarea,button").eq(0).focus();
  }

  return modal ? modalBox : warningBox;
}
show_message.prototype.setEventDispatcher = function (EventDispatcher) {
  this.eventDispatcher = EventDispatcher;
};
show_message.prototype.getEventDispatcher = function () {
  return this.eventDispatcher;
};

/**
 * The method returns jQuery object of error messages bar.
 *
 * @param {array} messages - an array of error messages
 * @returns jQuery element
 */
function createErrorBox(messages) {
  var text = messages.join("<br/>");
  return $(
    '\
        <div class="container red">\n\
            <div class="container-background">\n\
                <p>' +
      text +
      "</p>\n\
            </div>\n\
        </div>\n\
    ",
  );
}

/**
 * The method returns jQuery object of success messages bar.
 *
 * @param {array} messages - an array of success messages
 * @returns jQuery element
 */
function createSuccessBox(messages) {
  var text = messages.join("<br/>");
  return $(
    '\
        <div class="container green">\n\
            <div class="container-background">\n\
                <p>' +
      text +
      "</p>\n\
            </div>\n\
        </div>\n\
    ",
  );
}

/**
 * The method returns messages stored in session.
 *
 * @returns {jqXHR} - deferred object for request
 */
function getMessagesFromSession() {
  var defer = $.ajax({
    dataType: "json",
    type: "get",
    url: "/systemMessages/get",
    success: function (data) {
      return data;
    },
    error: function () {
      show_message(
        "error small",
        "Błąd",
        "Nie można pobrać treści komunikatów.",
        ["ok"],
        true,
      );
    },
  });
  return defer;
}

/**
 * The method removes all messages from session.
 *
 * @returns {jqXHR} - deferred object for request
 */
function removeMessagesFromSession() {
  var defer = $.ajax({
    dataType: "json",
    type: "post",
    url: "/systemMessages/remove",
    success: function (data) {
      return data;
    },
    error: function () {
      show_message(
        "error small",
        "Błąd",
        "Nie można usunąć błędów",
        ["ok"],
        true,
      );
    },
  });
  return defer;
}

/**
 * The method displays all error messages in bar placed in container with given id.
 *
 * @param {string} targetContainerId - an identifier of container element where bar with messages will be added
 * @returns void
 */
function displayErrorsAndRemoveMessagesFromSession(targetContainerId) {
  var fetchMessages = getMessagesFromSession();
  fetchMessages.done(function (messages) {
    var errors = messages.errors;
    if (errors.length > 0) {
      var messageBox = createErrorBox(errors);
      $("#" + targetContainerId).html(messageBox);
    }

    removeMessagesFromSession();
  });
}

/**
 * The method displays all success messages in bar placed in container with given id.
 *
 * @param {string} targetContainerId - an identifier of container element where bar with messages will be added
 * @returns void
 */
function displaySuccessAndRemoveMessagesFromSession(targetContainerId) {
  var fetchMessages = getMessagesFromSession();
  fetchMessages.done(function (messages) {
    var successes = messages.success;
    if (successes.length > 0) {
      var messageBox = createSuccessBox(successes);
      $("#" + targetContainerId).html(messageBox);
    }

    removeMessagesFromSession();
  });
}

/*
Creates a pop-up window with a checkbox to accept.

opts like {
  title: "The title of the window",
  message: "Main content of the window",
  checkboxLabel: "The text visible right next to the checkbox",
  cancelButtonLabel: "Cancel button",
  confirmButtonLabel: "Confirm button",
  onCancel: function () {}, //executed when the users cancels the operation
  onConfirm: function () {}, //executed when the user confirms the will to proceed
}
*/
function askForConfirmation(opts) {
  var defaultOptions = {
    title: "Potwierdzenie",
    message: "Prosimy o potwierdzenie chęci wykonania tej operacji.",
    checkboxLabel: "Chcę wykonać tę operację",
    cancelButtonLabel: "Anuluj",
    confirmButtonLabel: "Wykonaj",
    onCancel: function () {},
    onConfirm: function () {},
  };
  var fullOpts = $.extend({}, defaultOptions, opts);
  var messageHtml = $("<div/>").text(fullOpts.message).html();
  var checkboxId = "checkbox" + Math.round(Math.random() * 999999);
  var checkboxLabelHtml = $("<div/>").text(fullOpts.checkboxLabel).html();
  var layout = $(
    '\
  <div>\
    <div class="small center">\
      <p>' +
      messageHtml +
      '</p>\
      <p>\
        <input type="checkbox" id="' +
      checkboxId +
      '">\
        <label for="' +
      checkboxId +
      '">' +
      checkboxLabelHtml +
      "</label>\
      </p>\
      </div>\
  </div>\
  ",
  );
  var checkbox = layout.find("#" + checkboxId);
  var onConfirm, onCancel;
  var buttons = [
    //confirm
    {
      value: fullOpts.confirmButtonLabel,
      focus: false,
      click: function () {
        onConfirm();
      },
    },
    //cancel
    {
      value: fullOpts.cancelButtonLabel,
      focus: true,
      click: function () {
        onCancel();
      },
    },
  ];
  var popup = show_message("information medium", fullOpts.title, "", buttons);
  var close = function () {
    popup.remove();
  };
  onCancel = function () {
    close();
  };
  onConfirm = function () {
    fullOpts.onConfirm();
    close();
  };
  $(popup).find(".warning-content").replaceWith(layout);
  var confirmButton = $(popup).find(
    'input[value="' + fullOpts.confirmButtonLabel + '"]',
  );
  var disableConfirmButton = function () {
    confirmButton.attr("disabled", "disabled");
    newLayoutRefreshButtons();
  };
  disableConfirmButton();
  var enableConfirmButton = function () {
    confirmButton.removeAttr("disabled");
    newLayoutRefreshButtons();
  };
  checkbox.bind("change", function () {
    if ($(this).prop("checked")) {
      enableConfirmButton();
    } else {
      disableConfirmButton();
    }
  });
  return popup;
}

function recolor_table(table) {
  if (!(table instanceof jQuery)) {
    table = $(table);
  }
  var counter = 0;
  if (table.hasClass("decorated") && !table.hasClass("filters")) {
    table.find("tbody tr").each(function () {
      if ($(this).css("display") != "none") {
        if ($(this).hasClass("line1")) {
          $(this).removeClass("line1");
        }
        if ($(this).hasClass("line0")) {
          $(this).removeClass("line0");
        }
        $(this).addClass("line" + (counter % 2));
        counter++;
      }
    });
  }
}

function improve_justification(element) {
  var text = element.html();

  text = text.replace(/ a /g, " a&nbsp;");
  text = text.replace(/ i /g, " i&nbsp;");
  text = text.replace(/ w /g, " w&nbsp;");
  text = text.replace(/ z /g, " z&nbsp;");
  text = text.replace(/ o /g, " o&nbsp;");
  text = text.replace(/ , /g, " ,&nbsp;");
  text = text.replace(/ za /g, " za&nbsp;");
  text = text.replace(/ na /g, " na&nbsp;");
  text = text.replace(/ oraz /g, " oraz&nbsp;");
  text = text.replace(/ mu /g, " mu&nbsp;");
  text = text.replace(/ &ndash; /g, " &ndash;&nbsp;");
  text = text.replace(/ &ndash;&nbsp;/g, "&nbsp;&ndash;&nbsp;");
  text = text.replace(/ się /g, " się&nbsp;");
  text = text.replace(/ do /g, " do&nbsp;");

  element.html(text);
}

/*
Function: przekresl_tekst

  Set strike out text.

  Author:
  	Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - copy from funkcje_gui.php przekresl_tekst

  Parameters:

  	String  tresc - text to strike out
        String  czySkreslic - check if should strike out text.
        String  czyCSS - strike with css or html

  Returns:

  	String
*/
function przekresl_tekst(tresc, czySkreslic, czyCSS) {
  if (czySkreslic == undefined || czySkreslic == 1) {
    if (czyCSS == undefined || czyCSS == 1) {
      return '<span class="line-through">' + tresc + "</span>";
    } else {
      return "<del>" + tresc + "</del>";
    }
  } else {
    return tresc;
  }
}

/**
 * Function displays tooltip with hint.
 *
 * @param string $opis - text of hint
 * @param int $typPytajnika - type of question icon
 * @return string - html
 */

/*
Function: wyswietl_podpowiedz

  Function displays tooltip with hint.

  Author:
  	Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - copy from funkcje_gui.php wyswietl_podpowiedz

  Parameters:

  	string  opis - text of hint
        int typPytajnika - type of question icon

  Returns:

  	String
*/
function show_tooltip(msg, type) {
  return (
    '&nbsp;<img class="tooltip" alt="' +
    msg +
    '" title="' +
    msg +
    '" src="/images/pomoc_ciemna.png" />&nbsp;'
  );
}

/*
Function: ShowBooleanSymbol

  Function displays images instead "YES" / "NO"

  Author:
  	Mateusz Dybalski <mateusz.dybalski[at]librus.pl> - copy from funkcje_gui.php wyswietl_podpowiedz

  Parameters:
        String valueToChange - value to change
  	Array replaceTable - array with values to replace array('yes', 'no') or for more than one options array(array('yes', 'no'), array('tak', 'nie')),

  Returns:

  	String
*/
function show_boolean_symbol(valueToChange, replaceTable) {
  var yesArray = new Array();
  var noArray = new Array();

  if (replaceTable == undefined) {
    replaceTable = [
      ["yes", "no"],
      ["YES", "NO"],
      ["tak", "nie"],
      ["TAK", "NIE"],
      ["Tak", "Nie"],
      [1, 0],
      ["1", "0"],
      [true, false],
      ["true", "false"],
    ];
  }

  if ($.isArray(replaceTable) && replaceTable.length > 0) {
    if ($.isArray(replaceTable[0])) {
      for (var i = 0; i < replaceTable.length; i++) {
        yesArray.push(replaceTable[i][0]);
        noArray.push(replaceTable[i][1]);
      }
    } else {
      yesArray[0] = replaceTable[0];
      noArray[0] = replaceTable[1];
    }
  } else {
    return valueToChange;
  }

  if (jQuery.inArray(valueToChange, yesArray) > -1) {
    return (
      '&nbsp;<img class="tooltip" alt="' +
      valueToChange +
      '" title="' +
      valueToChange +
      '" src="/images/aktywne.png" />&nbsp;'
    );
  }

  if (jQuery.inArray(valueToChange, noArray) > -1) {
    return (
      '&nbsp;<img class="tooltip" alt="' +
      valueToChange +
      '" title="' +
      valueToChange +
      '" src="/images/nieaktywne.png" />&nbsp;'
    );
  }

  return valueToChange;
}

var createTooltip = function (element) {
  $(element).tooltip({
    track: true,
    show: { delay: 200, duration: 200 },
    hide: { delay: 100, duration: 200 },
  });
};

function refresh_tooltips() {
  var tolltipElements = $("a[title], input[title], td[title], .tooltip[title]");
  if (tolltipElements.length > 0) {
    tolltipElements.each(function () {
      createTooltip($(this));
    });
  }
}

function change_select_colors_from_background(element) {
  $.each($.browser, function (i, val) {
    if (i != "opera" && i != "safari") {
      $(element)
        .find("option")
        .each(function () {
          change_color_from_background(this);
        });
    }
  });
}

function change_color_from_background(element) {
  var background = new RGBColor($(element).css("background-color"));
  if (typeof background.a === "undefined" || background.a > 0) {
    var backgroundWeight = (background.r + background.g + background.b) / 3;
    if (backgroundWeight < 150) {
      $(element).css("color", "#ffffff");
    } else if (backgroundWeight < 190) {
      $(element).css("color", "#313332");
    }
  }
}

(function () {
  var proxied = window.print;
  window.print = function () {
    var tmpPaddingLeft = $("#body").css("padding-left");
    var tmpPaddingRight = $("#body").css("padding-right");
    $("#body").css("padding-left", 0);
    $("#body").css("padding-right", 0);

    proxied();

    $("#body").css("padding-left", tmpPaddingLeft);
    $("#body").css("padding-right", tmpPaddingRight);
  };
})();

var refreshDatePickers = function () {
  var headerZindex = $("#header").zIndex();
  $("input.datetimepicker").each(function () {
    $(this).css({ position: "relative" });
    var zIndex = $(this).zIndex();

    if (zIndex < headerZindex - 1) {
      zIndex = headerZindex - 1;
    }

    $(this).css({ position: "relative", "z-index": zIndex });
    $(this).datepicker({
      changeMonth: true,
      changeYear: true,
      changeMonthUseLongNames: true,
      yearRange: "-5:+1",
    });
  });

  $("input.date-pick").each(function () {
    setDatePicker(this);
  });
};

var setDatePicker = function (element) {
  var headerZindex = $("#header").zIndex();
  $(element).css({ position: "relative" });
  var zIndex = $(element).zIndex();

  if (zIndex < headerZindex - 1) {
    zIndex = headerZindex - 1;
  }

  $(element).css({ position: "relative", "z-index": zIndex });
  $(element).datepicker({
    changeMonth: true,
    changeYear: true,
    changeMonthUseLongNames: true,
    yearRange: "-5:+1",
  });

  $(element).mask("9999-99-99");
  $(element).change(function () {
    var tmp = $(this).val();
    var rxDatePattern = /^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/;
    var dtArray = tmp.match(rxDatePattern);
    if (dtArray == null) {
      $(this).val(tmp);
    } else {
      var dtYear = dtArray[1];
      var dtMonth = dtArray[3];
      var dtDay = dtArray[5];

      if (dtMonth > 12) {
        dtMonth = 12;
      } else if (dtMonth < 1) {
        dtMonth = 1;
      }
      if (dtDay > 31) {
        dtDay = 31;
      } else if (dtDay < 1) {
        dtDay = 1;
      }

      $(this).val(dtYear + "-" + dtMonth + "-" + dtDay);
    }
  });
};

var zwrocPustaTabele = function (text) {
  return $(
    '<div class="container border-red resizeable center"><div class="container-background"><p>' +
      text +
      "</p></div></div>",
  );
};

var showVariantError = function () {
  var message =
    "Ten moduł nie jest dostępny w wykorzystywanym przez szkołę wariancie rozwiązania " +
    appName1 +
    ".";
  show_message(
    "warning small",
    "Brak dostępu do modułu",
    message,
    ["ok"],
    true,
  );
};

var showModuleIsNotPartOfCommercialOfferPopUp = function () {
  show_message(
    "warning small",
    "Uwaga!",
    "Moduł nie stanowi części oferty komercyjnej LIBRUS Synergia.",
    ["ok"],
    true,
  );
};

var schowSchoolCommonRoomEmployeeError = function () {
  var message =
    "Dostęp mają jedynie pracownicy, którzy zostali dodani do modułu świetlicy. Aby uzyskać dostęp, skontaktuj się z kierownikiem świetlicy lub administatorem szkoły.";
  show_message(
    "warning small",
    "Brak dostępu do modułu",
    message,
    ["ok"],
    true,
  );
};

var refreshFoldMenus = function () {
  $(".container .fold")
    .unbind("click")
    .unbind("mouseover")
    .unbind("mouseleave")
    .click(function (event) {
      if ($(this).find(".more-options").length > 0) {
        $(this).find(".more-options").stop().animate(
          {
            height: "toggle",
          },
          100,
        );
      }
    })
    .mouseover(function (event) {
      if (
        $(this).find(".more-options").length > 0 &&
        $(this).find(".more-options").css("display") == "none"
      ) {
        $(this).find(".more-options").stop().animate(
          {
            height: "toggle",
          },
          100,
        );
      }
    })
    .mouseleave(function (event) {
      $(this).find(".more-options").stop().animate(
        {
          height: "toggle",
        },
        100,
      );
    });
};

var refreshBookmarks = function (container) {
  var deferred = new $.Deferred();
  container
    .find("ul.bookmarks>li>a")
    .click(function () {
      var bookmark = $(this);
      var callback = true;
      bookmark.parent().parent().find("li.active").removeClass("active");
      bookmark.parent().addClass("active");
      if (
        bookmark
          .parent()
          .parent()
          .parent()
          .find(".container-background>div.tab").length > 1
      ) {
        bookmark
          .parent()
          .parent()
          .parent()
          .find(".container-background>div.tab")
          .not("#" + bookmark.attr("for"))
          .stop()
          .slideUp(150, function () {
            if (callback) {
              $(this)
                .parent()
                .find("div.tab#" + bookmark.attr("for"))
                .slideDown(150, function () {
                  deferred.resolve();
                });
              callback = false;
            }
          });
      } else {
        bookmark
          .parent()
          .parent()
          .parent()
          .find(".container-background>div.tab")
          .stop()
          .slideDown(150);
      }
    })
    .promise()
    .done(function () {
      $(container).ready(function () {
        if (container.find("ul.bookmarks>li.active>a").length > 1) {
          container.find("ul.bookmarks>li.active>a").eq(0).click();
        } else if (container.find("ul.bookmarks>li.active>a").length > 0) {
          container.find("ul.bookmarks>li.active>a").click();
        } else if (container.find("ul.bookmarks>li>a").length === 0) {
          deferred.resolve();
        } else {
          container.find("ul.bookmarks>li>a").eq(0).click();
        }
        resizeButtons();
      });
    });

  return deferred;
};

var showRealisationAbilitiesModalBox = function (olID) {
  turn_preloader_on();
  $.ajax({
    dataType: "json",
    type: "post",
    url: "/ajax/slownikPP/umiejetnosciRealizacji",
    data: {
      olID: olID,
    },
    success: function (data) {
      turn_preloader_off();
      if (data["SUCCESS"]) {
        var message = show_message(
          "information big",
          "Umiejętności / efekty",
          "",
          [],
          true,
        );
        message
          .find(".warning-content")
          .html(data["CONTENT"])
          .promise()
          .done(function () {
            message.data("show_message_api").center();
          });
      } else {
        var buttons = ["ok"];
        $.each(data["ERRORS"], function (index, value) {
          show_message("error small", "Błąd", value, buttons);
        });
      }
    },
    error: function () {
      turn_preloader_off();
      var buttons = ["ok"];
      show_message(
        "error small",
        "Błąd",
        "Wystąpił błąd podczas ładowania umiejętności/efektów słownika podstawy programowej.",
        buttons,
      );
    },
  });
};

var buildInformationArea = function (titleText, contentHTML) {
  var htmlLayout = $(
    " \
        <div class='warning-box'> \
            <div class='warning-head'> \
                <span class='warning-title'>Informacja</span> \
                <span class='warning-close'>&nbsp;</span> \
            </div> \
            <div class='warning-content'> \
                <p></p> \
            </div> \
            <div class='warning-buttons'> \
            </div> \
        </div> \
    ",
  );
  htmlLayout.find(".warning-title").text(titleText);
  htmlLayout.find("p").html(contentHTML);

  return htmlLayout;
};

var showInformationInPopup = function (title, content) {
  var dialog = show_message("information", title, content, [
    {
      value: "Zamknij",
      click: function () {
        dialog.remove();
      },
    },
  ]);
};

var handleSingleSubmitButtons = function () {
  $(".single-submit-button").click(function (e) {
    e.preventDefault();
    var itsForm = $(this).parents("form");
    var itsName = $(this).attr("name");
    var itsValue = $(this).attr("value");
    if (itsName) {
      //unused submit button replacement
      var field = $('<input type="hidden" />');
      field.attr("name", itsName);
      field.attr("value", itsValue);
      itsForm.append(field);
    }

    $(this).prop("disabled", "disabled");
    newLayoutRefreshButtons();
    itsForm.submit();
  });
};

/*
    Function: removeOrphans

    Add &nbps; after one word words

    Author:
    Wojciech Anders

    Parameters:
    string text

    Returns:
    string
 */
var removeOrphans = function (text) {
  return text.replace(/\s([a-z])\s/g, " $1&nbsp;");
};

/*
    Function: removePolishChar

    changes Polish diacritical signs into Latin ones

    Parameters:
    string text

    Returns:
    string
 */
var removePolishChar = function (text) {
  return text
    .replace(/ą/g, "a")
    .replace(/Ą/g, "A")
    .replace(/ć/g, "c")
    .replace(/Ć/g, "C")
    .replace(/ę/g, "e")
    .replace(/Ę/g, "E")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .replace(/ń/g, "n")
    .replace(/Ń/g, "N")
    .replace(/ó/g, "o")
    .replace(/Ó/g, "O")
    .replace(/ś/g, "s")
    .replace(/Ś/g, "S")
    .replace(/ż/g, "z")
    .replace(/Ż/g, "Z")
    .replace(/ź/g, "z")
    .replace(/Ź/g, "Z");
};

function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return "&#" + c.charCodeAt(0) + ";";
  });
}
