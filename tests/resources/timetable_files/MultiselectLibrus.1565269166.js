/*
    Class:  MultiselectLibrus
 
    Description:
            Create multiselect with "All Field" option
         Author:
            Tomasz N.
 */

/*
    Create object MultiselectLibrus
    Sets select element to use in multiselect
    Sets sets all option field flag
    Parameters:
        string elementId - element id.
    Returns:
        void
 */

function MultiselectLibrus(elementId)
{
    this.selectDiv = document.getElementById(elementId);  
    this.multiselectObject = $(this.selectDiv).multiselect({
        header: false
    });
    this.start();
}

/*
    Sets start checked options array and
    sets multiselectclose and multiselectclick event
    Returns:
        void
 */
MultiselectLibrus.prototype.start = function ()
{
    var arrayStartChecked = $.map($(this.multiselectObject).multiselect("getChecked"), function (selectedItem) {
        return $(selectedItem).val();
    });

    var self = this;
    this.multiselectObject.bind('multiselectclose', function (event, ui) {
        if (self.sendSelectAllValue() !== true) {
            var optionVar = $(self.selectDiv).find("option[value=-1]");
            optionVar.prop("selected", false);
        }
    });

    this.multiselectObject.bind('multiselectclick', function (event, ui) {
        var arrayAfterClikChecked = $.map($(this).multiselect("getChecked"), function (selectedItem) {
            return $(selectedItem).val();
        });
        if (!self.IsSelectAllFieldChecked(arrayStartChecked)) {
            if ((self.IsSelectAllFieldChecked(arrayAfterClikChecked))) {
                $(this).multiselect("checkAll");
            }
        } else {
            if (!self.IsSelectAllFieldChecked(arrayAfterClikChecked)) {
                $(this).multiselect("uncheckAll");
            } else {
                $(this).multiselect("widget").find("input:checkbox[value=-1]").prop("checked", false); 
                if (self.sendSelectAllValue() === true) {
                    var optionVar = $(self.selectDiv).find("option[value=-1]");
                    optionVar.prop("selected", false);
                }
            }
        }

        arrayStartChecked = $.map($(this).multiselect("getChecked"), function (selectedItem) {
            return $(selectedItem).val();
        });

        var mySelect = $(this);
        var tooltip = self.multiselectTooltip(mySelect, arrayStartChecked);
        self.printMultiselectTooltip(mySelect, tooltip);
    });

    if (arrayStartChecked.length !== 0) {
        var tooltip = self.multiselectTooltip(this.multiselectObject, arrayStartChecked);
        self.printMultiselectTooltip(this.multiselectObject, tooltip);
    }
};

/*
    Print tooltip to multiselect
    Parameters:
        string mySelect - select.
        string tooltip - tooltip text.
    Returns:
        void
 */
MultiselectLibrus.prototype.printMultiselectTooltip = function (mySelect, tooltip) {
    mySelect.next("button").not(".tooltip").addClass("tooltip");
    mySelect.next("button").attr("title", tooltip);
    mySelect.next("button").tooltip({
        track: true,
        show: {
            delay: 200,
            duration: 200
        },
        hide: {
            delay: 100,
            duration: 200
        }
    });
};

/*
    Is select all field checked
    Parameters:
        array checkedValues - options value array.
    Returns:
        boolean
 */
MultiselectLibrus.prototype.IsSelectAllFieldChecked = function (checkedValues) {
    return (($.inArray("-1", checkedValues)) != -1);
};

/*
    Gets tooltip to multiselect
    Parameters:
        string thisSelect - selector.
        array arrayStartChecked - checked options array.
    Returns:
        string
 */
MultiselectLibrus.prototype.multiselectTooltip = function (thisSelect, arrayStartChecked) {
    var tooltip = "Wybrano:<br/>";
    $(arrayStartChecked).each(function (index) {
        if (this != -1) {
            tooltip += "- " + thisSelect.find("option[value=" + this + "]").text() + "<br/>";
        }
    });

    return tooltip;
};

/*
    Send select all value
    Returns:
        boolean - true if do not send select all value
 */
MultiselectLibrus.prototype.sendSelectAllValue = function () {
    return $(this.selectDiv).find("option[value=-1]").data("sendselectallvalue");
};
