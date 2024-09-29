//collection of rows you can perform search on

//single parameter
//construct
function Param(key, value, visible, matchStrategy) {
    this.value = value;
    this.key = key;
    this.visible = visible;
    this.matchStrategy = matchStrategy;
}
//match it against the query
Param.prototype.match = function(query) {
    if (this.matchStrategy == undefined) {
        throw this.key + " : " + "there's no matching strategy assigned with this param";
    }
    return this.matchStrategy.match(this, query);
}
//:single parameter

//abstract param match strategy
function AbstractParamMatchStrategy() {
}
//actual matching, should be overridden
AbstractParamMatchStrategy.prototype.doMatch = function(param, query) {
    throw "Cannot use an abstract parameter match strategy!";
}
//matching function (check whether the result is correct)
AbstractParamMatchStrategy.prototype.match = function(param, query) {
    var matchingResult = this.doMatch(param, query);
    if ((matchingResult < 0) || (matchingResult > 1)) {
        throw this.constructor + ": matching result is out of range";
    }
    return matchingResult;
}
//:abstract param match strategy

//simple param (equal or not) match strategy
function SimpleParamMatchStrategy() {}
SimpleParamMatchStrategy.prototype = new AbstractParamMatchStrategy();
SimpleParamMatchStrategy.prototype.constructor = SimpleParamMatchStrategy;
//actual match strategy
SimpleParamMatchStrategy.prototype.doMatch = function(param, query) {
    if (param.value == query) {
        return 1;
    } else {
        return 0;
    }
}
//:simple param (equal or not) match strategy


//class match strategy
function ClassParamMatchStrategy() {}
ClassParamMatchStrategy.prototype = new AbstractParamMatchStrategy();
ClassParamMatchStrategy.prototype.constructor = ClassParamMatchStrategy;
//normalize input
ClassParamMatchStrategy.prototype.normalizeCharacters = function(input) {
    return input.replace(/\s/gi, '').toLowerCase();
}
//input split
ClassParamMatchStrategy.prototype.splitWord = function(input) {
    return input.replace(/^\s+|\s+$/gi, '').split(/\s+/gi);
}
//actual match strategy
ClassParamMatchStrategy.prototype.doMatch = function(param, query) {
    var queryWords = this.splitWord(query);
    var normalizedInputValue = this.normalizeCharacters(param.value);
    var wordsScore = 0;
    //for each word in the query string
    for (wordIndex in queryWords) {
        var normalizedCurrentWord = this.normalizeCharacters(queryWords[wordIndex]);
        var currentWordScore = 1;
        var foundAtIndex = normalizedInputValue.indexOf(normalizedCurrentWord);
        if (foundAtIndex == -1) {
            continue;
        }
        
        var lengthBonusValue = (normalizedCurrentWord.length / normalizedInputValue.length);
        var positionBonusValue = (1 - (foundAtIndex / normalizedInputValue.length));
        wordsScore += (1 * lengthBonusValue * positionBonusValue);
    }
    
    return (wordsScore / queryWords.length);
}
//:class match strategy

//advanced param match strategy
function AdvancedParamMatchStrategy() {}
AdvancedParamMatchStrategy.prototype = new AbstractParamMatchStrategy();
AdvancedParamMatchStrategy.prototype.constructor = AdvancedParamMatchStrategy;
//input split
AdvancedParamMatchStrategy.prototype.splitWord = function(input) {
    return input.replace(/^\s+|\s+$/gi, '').split(/\s+/gi);
}
//normalizeCharacters
AdvancedParamMatchStrategy.prototype.normalizeCharacters = function(input) {
    var output = input;
    output = output.toLowerCase();
    return output;
}
//match a single word
AdvancedParamMatchStrategy.prototype.matchWord = function(queryWord, data) {
    if (data == queryWord) {
        return 1;
    }
    data = this.normalizeCharacters(data);
    queryWord = this.normalizeCharacters(queryWord);
    if (data == queryWord) {
        return 0.99;
    }  
    var indexOfQueryWord = data.indexOf(queryWord);
    if (indexOfQueryWord == -1) {
        return 0;
    }
    var remaining = 0.98;
    
    var positionValue = 1 - (indexOfQueryWord / (data.length - 1));
    var lengthValue = queryWord.length / data.length;
    return remaining * lengthValue * positionValue;
    
}
//actual match strategy
AdvancedParamMatchStrategy.prototype.doMatch = function(param, query) {
    if (query.replace(/\s/gi, '').length == 0) {
        return 1;
    }
    //the query is equal the param
    if (param.value == query) {
        return 1;
    }
    var queryWords = this.splitWord(query);
    var numberOfQueryWords = queryWords.length;
    var result = 0;
    for (i = 0; i < numberOfQueryWords; i++) {
        var singleWordMatchingResult = this.matchWord(queryWords[i], param.value);
        result += singleWordMatchingResult;
    }
    result = result / numberOfQueryWords;
    return result;
}
//:advanced param match strategy

//data row
function DataRow() {
    this.params = {};
    this.numberOfParams = 0;
    this.numberOfVisibleParams = 0;
}
DataRow.prototype.addParam = function(param) {
    this.params[param.key] = param;
    this.numberOfParams++;
    if (param.visible == true) {
        this.numberOfVisibleParams++;
    }
    
}
DataRow.prototype.match = function(query) {
    var result = 0;
    for (paramName in this.params) {
        if (this.params[paramName]["visible"] != true) {
            continue;
        }
        result += this.params[paramName].match(query);
    }
    return (result / this.numberOfVisibleParams);
}
DataRow.prototype.getAsSimpleObject = function() {
    var result = {};
    for (paramName in this.params) {
        result[paramName] = this.params[paramName].value;
    }
    return result;
}
//:data row

//data row collection
function DataRowCollection() {
    this.rows = new Array();    
}
DataRowCollection.prototype.addRow = function(row) {
    this.rows.push({"row" : row, "matchResult" : NaN});
}
//searching
DataRowCollection.prototype.search = function(query) {
    //start searching only if there are at least 2 characters
    if (query.replace(/^\s+|\s+$/gi, '').length < 2) {
        return new Array();
    }
    
    var resultRows = this.rows.slice();
    for (key in resultRows) {
        resultRows[key]["matchResult"] = resultRows[key]["row"].match(query);
    }

    resultRows.sort(function(row1, row2){
        var condition = (row1["matchResult"] - row2["matchResult"]);
        if (condition == 0) {
            return 0;
        }
        
        if (condition > 0) {
            return -1;
        } else {
            return 1;
        }
    });

    var simpleResult = new Array();
    for (key in resultRows) {
        //don't show rows that definitely doesn't match the seach query
        if (resultRows[key]['matchResult'] == 0) {
            continue;
        }
        
        simpleResult.push(resultRows[key]["row"].getAsSimpleObject());
    }

    return simpleResult;
}
//get cells
DataRowCollection.prototype.getCells = function() {
    if (this.rows.length == 0) {
        throw "Cells are not available, because there are no rows in the collection.";
    }

    var cells = new Array();
    for (paramKey in this.rows[0]["row"].params) {
        if (this.rows[0]["row"].params[paramKey].visible != true) {
            continue;
        }
        
        cells.push(paramKey);
    }

    return cells;
}
//:data row collection

//registry of param matching strategies
function ParamMatchStrategyRegistry() {
    this.strategies = {};
}
ParamMatchStrategyRegistry.prototype.getStrategy = function(name) {
    if (undefined == this.strategies[name]) {
        if (undefined == window[name]) {
            throw('ParamMatchStrategyRegistry: strategy ' + name + ' doesn\'t exist.');
        }
        this.strategies[name] = new window[name]();
    }
    return this.strategies[name];
}
//:registry of param matching strategies

//RowCollection Factory: JSON
function JSONRowCollectionFactory(JSONData) {
    this.JSONData = JSONData;
}
JSONRowCollectionFactory.prototype.getRowCollection = function() {
    var paramMachStrategyRegistry = new ParamMatchStrategyRegistry();
    var rowCollection = new DataRowCollection();
    for (rowIndex in this.JSONData) {
        var newRow = new DataRow();
        for (paramIndex in this.JSONData[rowIndex]) {
            var matchStrategy = undefined;
            if (this.JSONData[rowIndex][paramIndex]["visible"] == true) {
                 matchStrategy = paramMachStrategyRegistry.getStrategy(this.JSONData[rowIndex][paramIndex]["matchStrategy"]);
            }
            var newParam = new Param(
                this.JSONData[rowIndex][paramIndex]["key"],
                this.JSONData[rowIndex][paramIndex]["value"],
                this.JSONData[rowIndex][paramIndex]["visible"],
                matchStrategy
            );
            newRow.addParam(newParam);
        }
        rowCollection.addRow(newRow);
    }
    return rowCollection;
}
//:RowCollection Factory: JSON
