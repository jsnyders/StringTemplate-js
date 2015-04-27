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

    return type === "array" || length === 0 || (typeof length === "number" && length > 0 && (length - 1) in obj);
}

function typeOrClass(obj) {
    var cn, type = objType(obj);
    if (type === "object") {
        cn = obj.constructor && obj.constructor.name;
        if (cn && cn !== "Object") {
            type = cn;
        }
    }
    return type;
}

var groupPrototype = require("./stGroup");

var EMPTY_OPTIONS = {};

// xxx how to support debugging or tracing

// xxx this is all the private stuff that template functions need
var st = {

    // xxx todo: model adapters, error listeners


    /*
     * This must do two things write the value and process the options
     * xxx template value
     * xxx array like value
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
     *
     */
    write: function(writer, owningGroup, renderContext, value, options) {
        var charsWritten = 0;

        function writeObject(obj) {
            var i, v, n, nw, sep, wroteItem, fmt, renderer, text;

            if (obj == null) {
                if (options["null"]) {
                    obj = options["null"];
                } else {
                    return 0;
                }
            }
            if (obj === "a template") {
                // xxx todo
            } else if (isArraylike(obj)) {
                sep = options.separator;

                wroteItem = false;
                n = 0;
                for (i = 0; i < obj.length; i++) {
                    v = obj[i];
                    // if a value was previously written and there is a separator option and there is something to write
                    if (wroteItem && sep && (v != null || options["null"])) {
                        n += writer.writeSeparator(sep); // then write the separator option
                    }
                    nw = writeObject(v);
                    if (nw > 0) {
                        wroteItem = true;
                    }
                    n += nw;
                }
                return n;
            } else {
                // Get renderer from owning group and call with render context and format option
                fmt = options.format || null;
                renderer = owningGroup.getAttributeRenderer(typeOrClass(obj));
                if (renderer) {
                    text = renderer(obj, fmt, renderContext);
                } else {
                    text = obj.toString();
                }

                return writer.write(text, options.wrap);
            }
        }

        options = options || EMPTY_OPTIONS;

        if (options.anchor) {
            writer.pushAnchorPoint();
        }

        charsWritten = writeObject(value);

        if (options.anchor) {
            writer.popAnchorPoint();
        }

        return charsWritten;
    },

    prop: function(obj, property) {
        // todo model property accessor
        return obj[property];
    }
};

module.exports = {
    loadGroup: function(compiledGroup) {
        var group = Object.create(groupPrototype);
        group.templates = {};
        group.dictionaries = {};
        group.imports = [];
        group.renderers = {};
        return compiledGroup(st, group);
    }
};
