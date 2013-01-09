// Utility methods
// ---------------------------------------
var VNS = (typeof VNS === 'undefined') ? {} : VNS;

(function(){

    "use strict";

    // Prototype incorrectly converts Arrays to Strings when calling JSON stringify or equivalents, so we
    // delete the function
    delete Array.prototype.toJSON;
    
    VNS.test = {
        // Checks the validity of arguments returned from an HTML event object. We expect the objects
        // type to match the event that was originally fired and the target element to be the second  
        // argument
        validateEventArguments : function(args, targetElem, eventType) {
            expect(args.length).toBe(2);
            expect(args[0]).toBeDefined();
            expect(args[1]).toBeDefined();

            expect(args[0].type).toBe(eventType, "as the event object type and the event that was originally fired should match");
            
            // jQuery returns an array, so normalise here
            var eventTarget = args[1];

            eventTarget = (eventTarget.splice) ? eventTarget[0] : eventTarget;

            expect(eventTarget).toEqual(targetElem, "as the element and the target in the event object should match");
        },
        
        // Checks the validity of arguments returned from a window event object. In this case, we
        // expect the window event type to match the event that was originally launched
        validateWindowEventArguments : function(args, eventType) {
            expect(args.length).toBe(1);
            expect(args[0]).toBeDefined();
            expect(args[0].type).toBe(eventType, "as the event object type and the event that was originally fired should match");
        },
        
        // Triggers an event.
        // We try to use the Prototype or jQuery bridge functions, if available. Otherwise we default to
        // native functions.
        triggerEvent : function(node, type, from) {
            var evt;
            
            if(document.createEvent) {
                evt = document.createEvent("HTMLEvents");
                evt.initEvent(type, true, true);
                if(type === 'mouseout') {
                    evt.relatedTarget = from;
                }
                node.dispatchEvent(evt);
            } else {
                // If we can use jQuery to normalise events across dumb browsers, then do so
                if(typeof jQuery !== "undefined" && 
                        (type === "focus" || type === "blur" || type === "change" || type === "scroll" || type === "reset")) {
                    evt = jQuery.Event(type);
                    if(type === 'mouseout') {
                        evt.relatedTarget = from;
                    }
                    jQuery(node).trigger(evt);
                } else {
                    evt = document.createEventObject();
                    type = (type.toLowerCase() === "dblclick") ? type.toLowerCase() : type;
                    if(type === 'mouseout') {
                        evt.relatedTarget = from;
                    }
                    node.fireEvent("on" + type, evt);
                }
            }
        },
        
        // Queries the page
        query: function(selector) {
            if(typeof Prototype !== "undefined") {
                return $$(selector);
            }
            else if(jQuery !== "undefined") {
                return jQuery(selector);
            }
            else if(document.querySelectorAll) {
                return document.querySelectorAll(selector);
            }
            
            return [];
        },
        
        getObjectLength : function(obj) {
            var count = 0;
            for(var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    count++;
                }
            }
            
            return count;
        },
        
        toJSON: function(obj) {
            if(typeof JSON !== "undefined" && typeof JSON.stringify === "function") {
                return JSON.stringify(obj);
            }
            
            var array = [];
            for(var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    array.push('"'+ key +'":"'+ obj[key] +'"');
                }
            }
            return '{'+ array.join(',') +'}';
       }

    };
})();