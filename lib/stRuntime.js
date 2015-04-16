/*
 [The "BSD licence"]
 Copyright (c) 2015, John Snyders
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * stRuntime.js
 * xxx
 */
"use strict";

/*
 * Adapted from jQuery
 */
var i,
    typeNames = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"],
    class2type = {},
    toString = class2type.toString;

// Populate the class2type map
for (i = 0; i < typeNames.length; i++) {
    class2type[ "[object " + typeNames[i] + "]" ] = typeNames[i].toLowerCase();
}
console.log("xxx clas2type ", class2type);

function objType(obj) {
    if (obj == null) {
        return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ? class2type[ toString.call(obj) ] || "object" : typeof obj;
}


function isArraylike(obj) {
    var length = obj.length,
        type = objType(obj);

    if (type === "string" || type === "function" || obj != null && obj === obj.window) {
        return false;
    }

    if ( obj.nodeType === 1 && length ) {
        return true;
    }

    console.log("xxx isArraylike obj: ", obj);
    return type === "array" || length === 0 || (typeof length === "number" && length > 0 && (length - 1) in obj);
}


var groupPrototype = require("./stGroup");

var EMPTY_OPTIONS = {};

// xxx how to support debugging or tracing

// xxx this is all the private stuff that template functions need
var st = {


    /*
     * This must do two things write the value and process the options
     *
     * How a JavaScript value is turned into a string
     * null -> nothing  shouldn't get here
     * undefined -> nothing shouldn't get here
     * true -> "true"
     * false -> "false"
     * number -> "" + number
     * date -> ???
     * regexp -> ???
     * object ->
     *   if there is a render method call it xxx with what args?
     *   otherwise object.toString()
     * array -> always iterated over never rendered directly as a string
     * xxx the above are default behavior
     * register renderer for any of the above types. xxx how to map option to type?
     xxx where does escaping happen?
     * xxx todo: renders, model adapters, error listeners
     */
    write: function(writer, owningGroup, renderContext, value, options) {

        function writeObject(obj) {
            var i, v, sep, writeSep, text;

            if (obj == null) {
                if (options["null"]) {
                    obj = options["null"];
                } else {
                    return 0; //xxx what is return value?
                }
            }
            if (obj === "a template") {
                // todo
            } else if (isArraylike(obj)) {
                sep = options.separator;

                for (i = 0; i < obj.length; i++) {
                    v = obj[i];
                    // xxx separator
                    writeObject(v);
                }

            } else {
                // xxx todo get renderer from owning group and call with render context and format option
                // else
                text = obj.toString();

                return writer.write(text, options.wrap);
            }

        }

        options = options || EMPTY_OPTIONS;

        if (options.anchor) {
            writer.pushAnchorPoint();
        }

        writeObject(value);

        if (options.anchor) {
            writer.popAnchorPoint();
        }
    },

    prop: function(obj, property) {

    }
};

module.exports = {
    loadGroup: function(compiledGroup) {
        var group = Object.create(groupPrototype);
        group.templates = {};
        group.dictionaries = {};
        group.imports = [];
        return compiledGroup(st, group);
    }
};
