//quick search tool

//build the quick search tool
function QuickSearchTool(input) {
    if (input.data == undefined) {
        throw "You must specify the input data (key: data).";
    }
    this.settings = {
        "windowTitle" : "Wyszukiwarka",
        "maxNumberOfResults" : 10,
        "information" : ""
    };
    this.settings.information = "Tutaj możesz dokonać szybkiego wyszukiwania.<br>\
     Zobaczysz tu " + this.settings.maxNumberOfResults + " najbardziej pasujących rezultatów.\
     ";
    $.extend(this.settings, input);
    this.dataset = input.data;
    var rowCollectionFactory = new JSONRowCollectionFactory(this.dataset);
    this.rowCollection = rowCollectionFactory.getRowCollection();
    this.cells = this.rowCollection.getCells();
    this.createWindow();
}
//:build the quick search tool

//create the window
QuickSearchTool.prototype.createWindow = function() {
    this.window = show_message("information big", this.settings.windowTitle, '', [], true);
    this.window.find(".warning-content").html(this.getWindowLayout()).promise().done(function() {
        //set focus
        $(this).find(".qst_query_field").focus();
        //refresh buttons
        newLayoutRefreshButtons();
    });
    this.window.data("show_message_api").center();
}
//:create the window

//get window layout
QuickSearchTool.prototype.getWindowLayout = function() {
    //layout
    var layout = $("<div />");
    //:layout
    //search field
    var searchField = $("<input />");
    searchField.addClass("stretch");
    searchField.attr("class", " stretch searchField qst_query_field");
    searchField.attr("type", "text");
    var searchActionTimeout = undefined;
    searchField.on("change, keyup", {
        "quickSearchTool" : this,
        "searchActionTimeout" : searchActionTimeout
    } , function(e){
        if (e.data.searchActionTimeout != undefined) {
            clearTimeout(e.data.searchActionTimeout);
        }
        var valueToSearchFor = $(this).val();
        e.data.searchActionTimeout = setTimeout(function(){
            e.data.quickSearchTool.search(valueToSearchFor)
        }, 250);
    });
    //:search field    
    //main form
    var form = $("<form />");
    form.submit(function(e){
        e.preventDefault();
    });
    //:main form
    //result table
    var resultTable = $("<table />");
    this.resultTable = resultTable;
    resultTable.addClass("decorated");
    //header
    var tableHeader = $("<thead />");
    var headerRow = $("<tr />");
    //add cells
    for (cellIndex in this.cells) {
        var cellObject = $("<td />");
        var cellValue = this.cells[cellIndex];
        if (this.settings.headerNames[cellValue] != undefined) {
            cellValue = this.settings.headerNames[cellValue];
        }
        cellObject.append(cellValue);
        headerRow.append(cellObject);
    }
    //action column
    var actionCell = $("<td />");
    headerRow.append(actionCell);
    //add the row to the header
    tableHeader.append(headerRow);
    //add the header to the table
    resultTable.append(tableHeader);
    //body
    var tableBody = $("<tbody />");
    resultTable.append(tableBody);
    //footer
    var footer = $("<tfoot />");
    footer.append("<tr />");
    footer.find("tr").append("<td />");
    var footerCell = footer.find("td");
    footerCell.append("&nbsp;");
    footerCell.attr("colspan", this.cells.length + 1);
    resultTable.append(footer);
    //:result table
    
    //info container
    var infoContainer = $("<div />");
    infoContainer.addClass("warning-box");
    infoContainer.addClass("medium");
    infoContainer.append('<div class="warning-head">\
                                <span class="warning-title">Informacja</span>\
                                <span class="warning-close">&nbsp;</span>\
                            </div>\
                            <div class="warning-content">\
                                <p></p>\
                            </div>');
    infoContainer.find(".warning-content").find("p").html(this.settings.information);
    //:info container
    
    //connect elements
    form.append(searchField);
    var searchFormTable = $("<table />");
    searchFormTable.addClass("decorated medium center filters");
    searchFormTable.append("<thead><tr><td colspan='2'>&nbsp;</td></tr></thead>");
    searchFormTable.append("<tbody><tr><th class='small'>Wyszukiwarka</th><td></td></tr></tbody>");
    searchFormTable.append("<tfoot><tr><td colspan='2'>&nbsp</td></tr></tfoot>");
    var filterRow = searchFormTable.find("tbody tr");
    filterRow.find("td").append(form);
    layout.append(infoContainer);
    layout.append(searchFormTable);
    layout.append("<h3 class='center'>Wyniki wyszukiwania</h3>");
    layout.append(resultTable);
    //return the result
    return layout;
}
//:get window layout

//clear the result table
QuickSearchTool.prototype.clearResultTable = function() {
    this.resultTable.find("tbody").html("");
}
//:clear the result table

//perform search
QuickSearchTool.prototype.search = function(query) {
    //ger results
    var searchResults = this.rowCollection.search(query);
    //fill the table
    var tableBody = this.resultTable.find("tbody");
    this.clearResultTable();
    this.window.data("show_message_api").center();
    if (query.length == 0) {
        return;
    }
    //for each row
    for (resultId in searchResults) {
        if (resultId >= this.settings.maxNumberOfResults) {
            break;
        }
        //for eachc cell
        var rowObject = $("<tr />");
        for (cellIndex in this.cells) {
            var cellObject = $("<td />");
            var cellKey = this.cells[cellIndex];
            cellObject.append(searchResults[resultId][cellKey]);
            rowObject.append(cellObject);
        }
        var selectButtonCell = $("<td />");
        selectButtonCell.attr("class", "small");
        var selectButton = $("<input />");
        selectButton.attr("type", "button");
        selectButton.attr("value", "Wybierz");
        if (this.settings.rowOnClick != undefined) {
            selectButton.unbind("click").bind("click", {
                "rowModelData" : searchResults[resultId], 
                "rowOnClick" : this.settings.rowOnClick,
                'quickSearchTool': this
            }, function(e){
                e.data.rowOnClick(e.data.quickSearchTool, e.data.rowModelData);
            });
        }
        selectButtonCell.append(selectButton);
        rowObject.append(selectButtonCell);
        tableBody.append(rowObject);
    }
    this.window.data("show_message_api").center();
    recolor_table(this.resultTable);
    newLayoutRefreshButtons();
}
//:perform search
QuickSearchTool.prototype.close = function() {
    this.window.remove();
}
//:quick search tool