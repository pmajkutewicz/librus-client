
/*
 * options like {
     input_selector: "#myFileInput",
     validator_api_endpoint: "/dysk_sieciowy/defaultFileValidator",
     build_error_message: optional String fileRestrictionsDesc -> String
   }
 */
var attachFileValidatorToInput = function (options) {
    
    var validateFile = makeFileValidator(options.validator_api_endpoint);
    
    var getFileInput = function () { return $(options.input_selector); };
    
    var resetFileInput = function () {
        var emptyFileInput = getFileInput().val('').clone(true);
        getFileInput().replaceWith(emptyFileInput);
    };
    
    var build_error_message = options.build_error_message || function (fileRestrictions) {
        return "Wskazany plik nie spełnia poniższych wymagań:\n" + fileRestrictions;
    };
    
    var denyUnlessSupportedFile = function () {
        var file = this.files[0];
        validateFile(
            file.name, 
            file.size, 
            function () {}, 
            function () {
                getFileRestrictions(options.validator_api_endpoint, function (fileRestrictions) {
                    var html = $("<div />");
                    html.text(build_error_message(fileRestrictions));
                    show_message("error small", "Plik nie spełnia wymagań.", html.html().replace(/\n/ig, "<br>"), ["ok"]);
                });
                resetFileInput();
            }
        );
    };
    
    getFileInput().change(denyUnlessSupportedFile);
}

var getFileRestrictions = function (validatorEndpoint, cb, unknownRestrictions) {
    
    var returnUnknownRestrictions = function () {
        cb(unknownRestrictions ? unknownRestrictions : "Unknown restrictions");
    };
    
    var returnReadRestrictions = function (apiResponse) {
        if (apiResponse.restrictions) {
            cb(apiResponse.restrictions);
        } else {
            returnUnknownRestrictions();
        }
    }
    
    $.get(validatorEndpoint, returnReadRestrictions).fail(returnUnknownRestrictions)
};

var makeFileValidator = function (validatorEndpoint) {
    return function(fileName, filesizeInBytes, onValid, onInvalid) {
        var file = {
            name: fileName,
            size: filesizeInBytes
        };
        var handleValidationResult = function (apiResponse) {
            if (apiResponse.status === "success") {
                onValid();
            } else {
                onInvalid();
            }
        };
        $.post(validatorEndpoint, file, handleValidationResult);
    } 
};

function DefaultFileValidator()
{
}

DefaultFileValidator.prototype.validateFile = function(fileName, filesizeInBytes, onValid, onInvalid)
{
    $.post("/dysk_sieciowy/defaultFileValidator", {
        "name" : fileName,
        "size" : filesizeInBytes
    }, function(response) {
        if (response.status == "success") {
            onValid();
            return;
        }
        
        onInvalid();
    });
}
