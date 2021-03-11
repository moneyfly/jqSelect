/*
 * jqSelect
 * https://github.com/moneyfly/jqSelect
 * Author: Moneyfly
 * Copyright (c) 2020 jqSelect
 * Licensed under the MIT license.
 */"use strict";( function($) {
        // Collection method.
        $.fn.jqSelect = function(attrs) {
            var attrs = $.extend({
                "version" : "1.0",
                //"wrapper_class":"",
                //"options_class":"",
            }, attrs);

            return this.each(function(i) {
                if (this.tagName != "SELECT" && !(this.tagName === "INPUT" && this.getAttribute('type') === 'text' && this.hasAttribute('datalist'))) {
                    return;
                }
                var $this = $(this);
                $this.on("change",function(){
                    input.val($this.val());
                });
                // Get all select options
                var selectOptions = _options($this);
                var wrapper_class = "jqselect-wrapper options ";
                if(attrs.wrapper_class != undefined){
                    wrapper_class += attrs.wrapper_class;
                }
                var wrapper = $("<span>").addClass(wrapper_class).insertAfter($this);
                $this.hide();
                //Add input autocomplete
                var currentValue = $this.val();
                var input = $("<input>").appendTo(wrapper).val(currentValue).addClass("jqselect-input");
                if(this.tagName === "SELECT"){
                    input.attr("disabled",true);
                }
                input.on("keyup", function() {
                    _renderOptions(_search($(this).val(), selectOptions), dropdownOptions, input, $this);
                    dropdownOptions.show();
                }).on("input", function() {
                    _setOriginalInput($this, input.val());
                });
                //Add dropdown menu
                var dropdownOptions = $("<ul>").appendTo(wrapper).addClass("options-box");
                $(document).mouseup(function(e) {
                    // if the target of the click isn't the container nor a descendant of the container
                    if (!dropdownOptions.is(e.target) && dropdownOptions.has(e.target).length === 0) {
                        dropdownOptions.hide();
                    }
                });
                //Add show all button
                var dropbutton = $("<a>").appendTo(wrapper).attr("tabIndex", -1).addClass("jqselect-dropbutton");
                var wasOpen = false;
                dropbutton.on("mousedown", function() {
                    wasOpen = dropdownOptions.is(":visible");
                }).on("click", function() {
                    input.trigger("focus");
                    // Close if already visible
                    if (wasOpen) {
                        dropdownOptions.hide();
                        return;
                    }
                    _renderOptions(_search("", selectOptions), dropdownOptions, input, $this, attrs.options_class||"");
                    dropdownOptions.show();
                    // Pass empty string as value to search for, displaying all results
                });
            });
        };

        var _renderOptions = function(options, optionsContainer, input, originalInput, option_class) {
            /**
             * option (object) {text:'',val:''}
             */
            optionsContainer.html("");
            for (var i = 0; i < options.length; i++) {
                var _option_class = "options-item "+option_class+" "+"options-"+options[i].val.replace(" ", "").toLowerCase();
                $("<li>").appendTo(optionsContainer).html(options[i].text).attr("val", options[i].val).addClass(_option_class).on("click", function() {
                    input.val($(this).attr("val")).trigger("input");
                    optionsContainer.hide();
                });
            }
        };

        var _setOriginalInput = function(originalInput, val) {
            originalInput.val(val).trigger("change");
        };

        var _search = function(query, options) {
            query = query.replace(/ /g, "");
            return options.map(function() {
                // if query is empty, returen true;
                if (query == "") {
                    return {
                        'text' : this.text,
                        'val' : this.val
                    };
                }
                // Query Pattern Ignores caseSensitive
                var pattern = new RegExp(query, "gi");
                // Search for a match Query in Record
                var match = this.val.replace(pattern, function(x) {
                    return '<span class="options-highlight">' + x + '</span>';
                });
                if (match != this.val) {
                    return {
                        'text' : match,
                        'val' : this.val
                    };
                } else {
                    return null;
                }
            }).filter(function() {
                return this != null;
            });
        };

        var _options = function(elem) {
            if (elem.prop("tagName") == "SELECT") {
                var optionsElem = elem;
            } else if (elem.prop("tagName") == "INPUT" && elem.attr('datalist') != undefined) {
                var optionsElem = $("#" + $(elem).attr("datalist").trim());
            }
            return optionsElem.children("option").map(function() {
                var val = $(this).val();
                var text = $(this).text().trim();
                var text = text || val;
                return {
                    'text' : text,
                    'val' : val
                };
            });
        };
    }(jQuery));
