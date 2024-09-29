/**
    Title: indywidualni.js

    Description:
    Integration indywidualni.pl

    Author:
    Marcin Pruciak <marcin.pruciak[at]librus.pl>
*/
$(document).ready(function () {
  if ($("#tab-nauczycieli").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/widokDostepowNauczycieli",
      data: {},
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-nauczycieli").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          "Wystąpił błąd podczas ładowania widoku uprawnień nauczycieli.",
          buttons
        );
      },
    });
  }

  if ($("#tab-profil").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/widokTwojegoProfilu",
      data: {},
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-profil").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          "Wystąpił błąd podczas ładowania twojego profilu.",
          buttons
        );
      },
    });
  }

  window.addEventListener(
    "message",
    function (ev) {
      if (ev.origin !== APP_SETTINGS.idw_content_domain) {
        return;
      }

      if (ev.data == "getIframeAndDocumentPositions") {
        document
          .getElementById("idw-frame")
          .contentWindow.postMessage(
            {
              action: "set_position",
              top: $("#tab-profil").offset().top,
              scrollTop: $(document).scrollTop(),
            },
            APP_SETTINGS.idw_content_domain
          );
        return;
      }

      if (ev.data == "refresh") {
        $("body")
          .append(
            '<form id="idw-refresh-form" action="/indywidualni" method="POST"></form>'
          )
          .find("#idw-refresh-form")
          .append('<input name="resetConnectionId" value="1" />')
          .submit();
      }

      if (typeof ev.data.height !== "undefined") {
        if (ev.data.resource === "userProfile") {
          var frame = $("#iframe-profil");
          if (frame.length > 0) {
            frame
              .css({ height: "100%" })
              .parents(".warning-content")
              .css({ height: "100%" });
            frame.parents(".modal-box").data("show_message_api").center();
          }
        } else if (
          ev.data.resource === "childProfile" &&
          $(".warning-content #iframe-profil").length > 0
        ) {
          var frame = $("#iframe-profil");
          if (frame.length > 0) {
            frame
              .css({ height: "100%" })
              .parents(".warning-content")
              .css({ height: "100%" });
            frame.parents(".modal-box").data("show_message_api").center();
          }
        } else {
          $("#idw-frame").height(ev.data.height);
          var frame = $("#idw-group-profil");
          if (frame.length > 0) {
            frame
              .css({ height: "100%" })
              .parents(".warning-content")
              .css({ height: "100%" });
            frame.parents(".modal-box").data("show_message_api").center();
          }
        }
      }
    },
    false
  );

  if ($("#tab-o-projekcie").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/stronaOprojekcie",
      data: {},
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-o-projekcie").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          'Wystąpił błąd podczas ładowania strony "O projekcie".',
          buttons
        );
      },
    });
  }
  if ($("#tab-wyszukiwarka").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/wyszukiwarka/wyszukiwarka",
      data: {},
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-wyszukiwarka").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          "Wystąpił błąd podczas ładowania bazy metod i technik",
          buttons
        );
      },
    });
  }
  if ($("#tab-zasoby").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/widokZasobow",
      data: {},
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-zasoby").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          "Wystąpił błąd podczas ładowania zasobów",
          buttons
        );
      },
    });
  }

  if ($.trim(window.location.hash).length > 0) {
    if ($($.trim(window.location.hash)).length > 0) {
      $(document).one("ajaxStop", function () {
        $("a[for='" + $.trim(window.location.hash).replace("#", "") + "']")
          .parent()
          .not(".active")
          .children("a")
          .click();
      });
    }
  }

  if ($("#tab-uczniow").length > 0) {
    $.ajax({
      dataType: "json",
      type: "post",
      url: "/ajax/indywidualni/widokDostepowUczniow",
      data: {
        jednostka: $("#indywidualni-js-jednostka").val(),
        klasa: $("#indywidualni-js-klasa").val(),
      },
      success: function (data) {
        if (data["SUCCESS"]) {
          $("#tab-uczniow").html(data["CONTENT"]);
        } else {
          var buttons = ["ok"];
          $.each(data["ERRORS"], function (index, value) {
            show_message("error small", "Błąd", value, buttons);
          });
        }
      },
      error: function () {
        var buttons = ["ok"];
        show_message(
          "error small",
          "Błąd",
          "Wystąpił błąd podczas ładowania widoku uprawnień uczniów.",
          buttons
        );
      },
    });
  }
});
