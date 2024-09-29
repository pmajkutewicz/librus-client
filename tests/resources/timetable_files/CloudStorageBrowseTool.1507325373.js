//cloud storage - select file tool

//build Cloud Storage Select Tool
function CloudStorageBrowseTool(settings, fileValidator)
{
    this.fileValidator = fileValidator
    this.dirWatchingAction = undefined;
    this.settings = {
        "closed" : true,
        "windowTitle" : "Wybierz plik z dysku sieciowego",
        "onFileSelect" : function(csbt, fileId, fileName, fileSize) {}
    };
    $.extend(this.settings, settings);
    this.createWindow();
    this.tooSlowWarningIsDisplayed = false;
}
//:build Cloud Storage Select Tool

//create window
CloudStorageBrowseTool.prototype.createWindow = function() {
    this.settings.closed = false;
    this.window = show_message("information medium", this.settings.windowTitle, '', [], true);
    this.window.find(".warning-content").html(this.getWindowLayout()).promise().done(function() {
        newLayoutRefreshButtons();
    });
    this.window.data("show_message_api").center();
    this.closeButton = this.window.children(".warning-box").children(".warning-head").children(".warning-close");
    var csbt = this;
    this.closeButton.bind("click", function() {
        csbt.close();
    });
}
//:create window

//get window layout
CloudStorageBrowseTool.prototype.getWindowLayout = function() {
    //layout
    var layout = $("<div />");
    this.mainTable = $("<table class='decorated'></table>");
    var tableHeader = $("<thead><tr><td colspan='2'></td></tr></thead>");
    this.tableBody = $("<tbody></tbody>");
    var tableFooter = $("<tfoot><tr><td colspan='2'></td></tr></tfoot>");
    this.mainTable.append(tableHeader);
    this.mainTable.append(this.tableBody);
    this.mainTable.append(tableFooter);
    layout.append(this.mainTable);
    
    this.mainButtonsFrame = $("<div />");
    this.cancelButton = $("<input type='button' value='Anuluj'>");
    this.mainButtonsFrame.append(this.cancelButton)
    this.cancelButton.addClass("right");
    var csbt = this;
    this.cancelButton.on("click", function() {
        csbt.close();
    });
    layout.append(this.mainButtonsFrame);
    this.lsDir();
    return layout;
}
//:get window layout

//clean list of dirs
CloudStorageBrowseTool.prototype.cleanList = function() {
    this.tableBody.html("");
}
//:clean list of dirs

CloudStorageBrowseTool.prototype.collapseDir = function(dir) {
    var node = this.tableBody.find("tr[data-selfid='" + dir + "']");
    node.find(".buttonExpand").css("display", "inline-block");
    node.find(".buttonCollapse").css("display", "none");
    var relatedNodes = this.tableBody.find("tr[data-parent='" + dir + "']");
    
    var csbt = this;
    $.each(relatedNodes, function(k,v) {
        csbt.collapseDir($(v).attr("data-selfid"));
    });
    
    relatedNodes.remove();
}

CloudStorageBrowseTool.prototype.expandDir = function(dir) {
    this.collapseDir(dir);
    var node = this.tableBody.find("tr[data-selfid='" + dir + "']");
    node.find(".buttonExpand").css("display", "none");
    node.find(".buttonCollapse").css("display", "inline-block");
    var nodeDepth = parseInt(node.attr("data-depth"));
    this.lsDir(dir, (nodeDepth + 1));
}


//append dir list object
CloudStorageBrowseTool.prototype.dirListAppend = function(element, parentId, depth) {
    var csbt = this;
    var singleDirItem = element;
    var singleDirItemId = singleDirItem.id;

    var row = $("<tr />");
    
    row.attr("data-depth", depth);
    
    var tmp = parentId;

    row.attr("data-parent", parentId);
    row.attr("data-selfid", singleDirItem.id);
    
    
    var iconElement = $("<img src='' alt=''> ");
    iconElement.attr("src", singleDirItem.iconUrl);
    
    var nameCellMainSpan = $("<span />");
    nameCellMainSpan.addClass("nowrap");
    
    if (singleDirItem.type == "file") {
        var actualNameCell = $("<a href='javascript:void(0)' />");
    } else {
        var actualNameCell = $("<span>");
    }
    
    actualNameCell.addClass("nowrap");
    actualNameCell.text(singleDirItem.name);
    var csbt = this;
    if (singleDirItem.type == "file") {
        actualNameCell.on("click", function(e) {
            csbt.tryToTriggerOnFileSelect(element.id, element.name, element.size);
        });
    }
    
    var spacingCell = $("<span />");
    spacingCell.addClass("nowrap");
    for (i = 0; i < depth; i++) {
        spacingCell.append("&nbsp;&nbsp;&nbsp;&nbsp;");
    }
    nameCellMainSpan.append(spacingCell);
    
    if (singleDirItem.type == "dir") {
        //expand and collapse buttons
        var buttonExpand = $("<a href='javascript:void(0)' class='buttonExpand'><img src='/images/tree_colapsed.png'></a> ");
        var buttonCollapse = $(" <a href='javascript:void(0)'  class='buttonCollapse' ><img src='/images/tree_expanded.png'></a> ");
        buttonCollapse.hide();
        buttonExpand.on("click", function() {
            csbt.expandDir(singleDirItemId);
        });

        buttonCollapse.on("click", function() {
            csbt.collapseDir(singleDirItemId);
        });

        nameCellMainSpan.append(buttonExpand);
        nameCellMainSpan.append(buttonCollapse);
        nameCellMainSpan.append("&nbsp;");
    }
    
    nameCellMainSpan.append(iconElement);
    nameCellMainSpan.append("&nbsp;");
    
    nameCellMainSpan.append(actualNameCell);
    
    
    var nameCell = $("<td />");
    nameCell.append(nameCellMainSpan);

    row.append(nameCell);
    
    if (parentId.length > 0) {
        
        var rowBefore = this.tableBody.find("tr[data-selfid='" + parentId  + "']");
        if (rowBefore.length > 0) {
            var lastLeaf = this.tableBody.find("tr[data-parent='" + parentId  + "']").last();
            if(lastLeaf.length > 0) {
                rowBefore = lastLeaf;
            }
        }
        rowBefore.after(row);
    } else {
        this.tableBody.append(row);
    }

}
//:append dir list object

CloudStorageBrowseTool.prototype.tryToTriggerOnFileSelect = function(elementId, elementName, elementSize)
{
    var csbt = this;
    this.fileValidator.validateFile(elementName, elementSize, function() {
        csbt.settings.onFileSelect(csbt, elementId, elementName, elementSize);
    }, function() {
        show_message("error small", "Błąd", "Plik jest zbyt duży lub ma nieprawidłowe rozszerzenie", ["ok"]);
    });
}

//fill the view with list
CloudStorageBrowseTool.prototype.fillListWithData = function(data, parentDir, depth) {
    for (contentObjectId in data) {
        this.dirListAppend(data[contentObjectId], parentDir, depth);
    }
    
    turn_preloader_off();
    newLayoutRefreshButtons();
    this.window.data("show_message_api").center();
    recolor_table(this.mainTable);
}

//watch list action
CloudStorageBrowseTool.prototype.watchListAction = function(listActionId, dir, depth, attemptNumber) {
    if (this.settings.closed == true) {
        return;
    }
    
    var currentAttemptNumber = attemptNumber;
    var csbt = this;
    
    if (currentAttemptNumber == undefined) {
        currentAttemptNumber = 1;
    }
    
    if (((currentAttemptNumber % 15) == 0) && !this.tooSlowWarningIsDisplayed) {
        var curtainIndex = $("#preloader-box").css("z-index");
        if (curtainIndex === undefined) {
            curtainIndex = 0;
        } else {
            curtainIndex = parseInt(curtainIndex);
        }
        
        var alertWindow = show_message(
            'error small', 
            'Operacja trwa dłużej niż zwykle', 
            'Mechanizm działa wolniej niż zwykle. Czy chcesz zaczekać, czy anulować proces?',
            [
                {
                    value: 'Zaczekaj',
                    close: true,
                    size: 'medium',
                    click: function () {
                        csbt.tooSlowWarningIsDisplayed = false;
                    }
                },
                {
                    value: 'Przerwij proces',
                    close: true,
                    size: 'medium',
                    click: function () {
                        csbt.close();
                    }
                },
            ],
            true
         );
        this.tooSlowWarningIsDisplayed = true;
        alertWindow.css("z-index", curtainIndex + 1)
        alertWindow.on('remove', function () {
            csbt.tooSlowWarningIsDisplayed = false;
        });
    }
    
    $.post("/dysk_sieciowy/listDir", {
        "action" : listActionId
    }, function(data){
        if ((data.status == undefined) || csbt.settings.closed == true) {
            return;
        }
        
        if (data.status == "error") {
            var errorReasonMsg = "Wystąpił problem w komunikacji z dyskiem sieciowym. Spróbuj ponownie później.";
            if (data.reason == "storage_expired") {
                errorReasonMsg = "Dysk sieciowy wymaga ponownego zalogowania się. Zaloguj się ponownie i spróbuj później.";
            }
            
            show_message("error small", "Błąd", errorReasonMsg, ["ok"]);
            turn_preloader_off();
            csbt.close();
            return;
        }
        
        if (data.status == "not_finished_yet") {
            csbt.dirWatchingAction = setTimeout(function(){
                csbt.watchListAction(listActionId, dir, depth, (currentAttemptNumber + 1));
            }, 1500);
        }
        
        if (data.status == "finished") {
            csbt.fillListWithData(data.directoryContent, dir, depth);
        }
    });
}

//list dir
CloudStorageBrowseTool.prototype.lsDir = function(dir, depth) {
    if (depth == undefined) {
        depth = 0;
    }
    
    var dataToSent = {};
    dataToSent.dir = dir;
    
    if (dir == undefined) {
        dir = "";
    }
    
    turn_preloader_on();
    var csbt = this;
    //get listing action
    $.post('/dysk_sieciowy/listDir/getAction', dataToSent, function(data){
        if (data.actionId == undefined) {
            return;
        }
        
        csbt.watchListAction(data.actionId, dir, depth);
    });
}
//:list dir

//close window
CloudStorageBrowseTool.prototype.close = function() {
    this.settings.closed = true;
    clearTimeout(this.dirWatchingAction);
    turn_preloader_off();
    this.window.remove();
}
//::close window

//:cloud storage - select file tool




