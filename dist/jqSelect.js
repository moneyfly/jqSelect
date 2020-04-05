/*! jqSelect - v0.0.1 - 2020-04-05
* Copyright (c) 2020 Moneyfly; Licensed MIT */
"use strict";( function($) {
        // Collection method.
        $.fn.jqSelect = function(options) {
            options = $.extend({
                "version" : "1.0"
            }, options);

            return this.each(function() {
                if (this.tagName != "SELECT" && !(this.tagName === "INPUT" && this.getAttribute('type') === 'text' && this.hasAttribute('datalist'))) {
                    return;
                }
                var $this = $(this);
                // Get all select options
                var selectOptions = _options($this);
                var wrapper = $("<span>").addClass("jqselect-wrapper options").insertAfter($this);
                $this.hide();
                //Add input autocomplete
                var currentValue = $this.val();
                var input = $("<input>").appendTo(wrapper).val(currentValue).addClass("jqselect-input");
                input.on("keyup", function() {
                    _renderOptions(_search($(this).val(), selectOptions), dropdownOptions, input, $this);
                    dropdownOptions.show();
                }).on("input",function(){
                    _setOriginalInput($this,input.val());
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
                    _renderOptions(_search("", selectOptions), dropdownOptions, input, $this);
                    dropdownOptions.show();
                    // Pass empty string as value to search for, displaying all results
                });
            });
        };

        var _renderOptions = function(options, optionsContainer, input, originalInput) {
            /**
             * option (object) {text:'',val:''}
             */
            optionsContainer.html("");
            for (var i = 0; i < options.length; i++) {
                $("<li>").appendTo(optionsContainer).html(options[i].text).attr("val", options[i].val).addClass("options-item").on("click", function() {
                    input.val($(this).attr("val")).trigger("input");
                    optionsContainer.hide();
                });
            }
        };
        
        var _setOriginalInput = function(originalInput,val){
            originalInput.val(val);
        };

        var _search = function(query, options) {
            query = query.replace(/ /g, "");
            return options.map(function() {
                // if query is empty, returen true;
                if (query == "") {
                    return {
                        'text' : this,
                        'val' : this
                    };
                }
                // Query Pattern Ignores caseSensitive
                var pattern = new RegExp(query, "gi");
                // Search for a match Query in Record
                var match = this.replace(pattern, function(x) {
                    return '<span class="options-highlight">' + x + '</span>';
                });
                if (match != this) {
                    return {
                        'text' : match,
                        'val' : this
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
                return $(this).val();
            });
        };
    }(jQuery));
