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
 *
 */
/**
 * @module stringtemplate-js
 * 
 */
"use strict";

var path = require("path"),
    autoIndentWriter = require("./autoIndentWriter"),
    stErrors = require("./errors").st,
    Dictionary = require("./Dictionary"),
    Template = require("./Template");

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
    if (obj === null) {
        return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ? class2type[ toString.call(obj) ] || "object" : typeof obj;
}


function isArrayLike(obj) {
    var length,
        type = objType(obj);

    if (type === "null" || type === "undefined" || type === "string" || type === "function" || obj !== null && obj === obj.window) {
        return false;
    }

    length = obj.length;
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
var Template = require("./Template");

var EMPTY_OPTIONS = {};


var dictionaryModelAdaptor = function(dict, propName) {
    return dict.get(propName);
};

var loadGroup = function(compiledGroup) {
    var group = Object.create(groupPrototype);
    group.templates = {};
    group.dictionaries = {};
    group.imports = [];
    group.renderers = {};
    group.modelAdaptors = {};
    group.registerModelAdaptor("Dictionary", dictionaryModelAdaptor);
    return compiledGroup(st, group);
};

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
    write: function(writer, scope, owningGroup, renderContext, value, options) {
        var charsWritten = 0;

        function writeObject(obj) {
            var i, v, n, nw, sep, wroteItem, fmt, renderer, text;

            if (obj === null) {
                if (options["null"]) {
                    obj = options["null"];
                } else {
                    return 0;
                }
            }
            if (obj instanceof Template) {
                // arguments have already been added
                // xxx but ref impl always gets a new scope! so far with named templates where we do group.getTemplate
                // right before this call there is no problem but if the template is put into the data or comes from
                // a dictionary property then the scope will not have been set or will be wrong.
                // xxx apply defaults
                if (!obj._hasParentScope) {
                    obj.setScope(scope);
                }

                if (options.wrap) {
                    // if we have a wrap string, then inform writer it
                    // might need to wrap
                    writer.writeWrap(options.wrap);
                }

                obj.write(writer, renderContext);
                // xxx need to return the number of chars written
                return 1;
            } else if (isArrayLike(obj)) {
                sep = options.separator;

                wroteItem = false;
                n = 0;
                for (i = 0; i < obj.length; i++) {
                    v = obj[i];
                    // if a value was previously written and there is a separator option and there is something to write
                    if (wroteItem && sep && (v !== null || options["null"])) {
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

    prop: function(scope, owningGroup, renderContext, obj, property, location) {
        var adaptor = owningGroup.getModelAdaptor(typeOrClass(obj));
        if (obj === null || obj === undefined) {
            owningGroup.reportRuntimeError(location || null, stErrors.PROPERTY_NOT_FOUND, null, property);
            return null;
        }
        property = this.toString(scope, owningGroup, renderContext, property);
        if (adaptor) {
            return adaptor(obj, property);
        } // else
        if (obj[property] !== undefined) {
            return obj[property];
        }
        owningGroup.reportRuntimeError(location || null, stErrors.PROPERTY_NOT_FOUND, obj, property);
        return null;
    },

    /*
     * Apply single array attribute to one or more templates.
     */
    map: function(attr, templates) {
        var i, c, t, a,
            tr = [];

        if (attr === null || attr === undefined) {
            return null;
        } // else

        if (!isArrayLike(attr)) {
            // in the context of map operator ':' iterate over properties of an object
            if (typeof attr === "object") {
                attr = Object.keys(attr);
            } else {
                attr = [attr];
            }
        }

        c = 0;
        for (i = 0; i < attr.length; i++) {
            t = templates[c % templates.length];
            a = attr[i];
            if (a === null) {
                tr.push(a);
            } else {
                // xxx need to create a clone of the template so each one can have different args
                t = t.clone();
                //xxx t.clear(); // other args were set already so can't clear
                t.addImplicit(a); // xxx other args
                if (t.isAnonSubtemplate) {
                    t.add("i0", c);
                    t.add("i", c + 1);
                }
                c += 1;
                tr.push(t);
            }
        }

        if (tr.length === 1) {
            tr = tr[0];
        }
        return tr;
    },

    /*
     * Apply one or more array attributes to a single template.
     * The ith elements of each of the arrays are are taken in order as arguments to the template
     * Example:
     *   $a, b, c : t()$
     * where a and b are arrays with 3 elements and c is an array with 2 elements, template t would
     * be called like so:
     *   t(a[0], b[0], c[0])
     *   t(a[1], b[1], c[1])
     *   t(a[2], b[2], null)
     */
    zipMap: function(attrs, template) {
        var i, j, t, attr, args,
            formalArgNames = [],
            len = 0,
            tr = [];

        if (attrs === null || attrs.length === 0) {
            return null;
        } // else
        // make all the attributes arrays
        for (i = 0; i < attrs.length; i++) {
            attr = attrs[i];
            if (!isArrayLike(attr)) {
                // in the context of map operator ':' iterate over properties of an object
                if (typeof attr === "object") {
                    attr = attrs[i] = Object.keys(attr);
                } else {
                    attr = attrs[i] = [attr];
                }
            }
            // find the max length
            if (attr) {
                if (attr.length > len) {
                    len = attr.length;
                }
            }
        }

        args = template.render.args;
        if (args.length !== attrs.length) {
            console.log("xxx zip MAP_ARGUMENT_COUNT_MISMATCH");
        }
        for (i = 0; i < args.length; i++) {
            formalArgNames.push(args[i].name);
        }

        for (i = 0; i < len; i++) {
            t = template.clone();

            // xxx why does ref impl only do this for may with anon template but always adds for zip_map?
            t.add("i0", i);
            t.add("i", i + 1);

            for (j = 0; j < attrs.length; j++) {
                attr = attrs[j];
                if (attr && i < attr.length) {
                    t.add(formalArgNames[j], attr[i]);
                }
                else {
                    t.add(formalArgNames[j], null);
                }
            }
            tr.push(t);
        }

        if (tr.length === 1) {
            tr = tr[0];
        }
        return tr;
    },

    test: function(a) {
        if (isArrayLike(a)) {
            return a.length !== 0;
        } // else
        return !!a;
    },

    toString: function(scope, owningGroup, renderContext, expr) {
        var stw;

        if (typeof expr === "string") {
            return expr;
        }

        // todo THINK: Java reference impl tries to make the same kind of writer that is being used to process the overall template
        stw = autoIndentWriter.makeWriter();
        this.write(stw, scope, owningGroup, renderContext, expr);
        return stw.toString();
    },

    makeAnonTemplate: function(owningGroup, renderer) {
        // xxx what to do about scope
        return new Template({}, owningGroup, renderer);
    },

    makeSubTemplate: function(owningGroup, renderer, args) {
        var t;
        // xxx what to do about scope
        t = new Template({}, owningGroup, renderer, true);
        renderer.args = args;
        return t;
    },

    loadImport: function(base, file) {
        var g;
        file = file.replace(/\.stg$/, "_stg").replace(/\.st$/, "_st");
        file = path.join(base, file);
        g = require(file);
        return loadGroup(g);
    },

    Dictionary: Dictionary,

    /*
     * The builtin StringTemplate functions
     */
    fn: {
        /**
         * Return the first element of the input array.
         * @param a any value but typically an array
         * @returns {*} first element of input array or a if it is not an array xxx or is empty
         */
        first: function(a) {
            if (isArrayLike(a) && a.length > 0) {
                return a[0];
            } // else
            return a;
        },

        /**
         * Return the last element of the input array.
         * @param a any value but typically an array
         * @returns {*} last element of input array or a if it is not an array xxx or is empty
         */
        last: function(a) {
            if (isArrayLike(a) && a.length > 0) {
                return a[a.length - 1];
            } // else
            return a;
        },

        /**
         * Return all but the first element of the input array.
         * @param a any value but typically an array
         * @returns {*} any array with all elements of the input array except the first or null if not an array
         * xxx when array has 0 or 1 elements not sure if this gives the same result as ref impl 
         */
        rest: function(a) {
            if (isArrayLike(a)) {
                return a.slice(1);
            } // else
            return null;
        },

        /**
         * Return all but the last element of the input array.
         * @param a any value but typically an array
         * @returns {*} any array with all elements of the input array except the last or null if not an array
         * xxx when array has 0 or 1 elements not sure if this gives the same result as ref impl
         */
        trunc: function(a) {
            if (isArrayLike(a)) {
                return a.slice(0, a.length - 1);
            } // else
            return null;
        },

        /**
         * Return length of the input array.
         * @param a any value but typically an array
         * @returns {number} length of array or 0 if input is null or undefined or 1 if input is a scalar value or object
         */
        length: function(a) {
            if (a === null || a === undefined) {
                return 0;
            } else if (isArrayLike(a)) {
                return a.length;
            } // else a must be a scalar
            return 1;
        },

        /**
         * Return an array that is the same as the input array but with the elements reversed 
         * @param a any value but typically an array
         * @returns {*} array with elements reversed or a if it is not an array
         */
        reverse: function(a) {
            if (isArrayLike(a)) {
                return a.slice().reverse(); // copy and reverse
            } // else
            return a;
        },

        /**
         * Return an array that is the same as the input array but with all null elements removed
         * @param a any value but typically an array
         * @returns {*} array with null elements removed or a if it is not an array
         */
        strip: function(a) {
            var i, el, a2;
            if (isArrayLike(a)) {
                a2 = [];
                for (i = 0; i < a.length; i++) {
                    el = a[i];
                    if (el !== null && el !== undefined) {
                        a2.push(el);
                    }
                }
                return a2;
            } // else
            return a;
        },

        /**
         * Return copy of input with leading and trailing white space characters removed 
         * @param str string to trim
         * @returns {String} copy of string with leading and trailing white space trimmed
         */
        trim: function(str) {
            if (typeof str === "string") {
                return str.trim();
            }
            throw new Error("trim argument must be a string"); // xxx how to report this?
        },

        /**
         * Return the length of a string
         * @param str string to get the length of
         * @returns {number} length of string
         */
        strlen: function(str) {
            if (typeof str === "string") {
                return str.length;
            }
            throw new Error("strlen argument must be a string"); // xxx how to report this?
        }
    }

};

module.exports = {
    /**
     * @function loadGroup
     * Load a group 
     * @param {object} compiledGroup A compiled group to turn into a group
     * @return {group}
     */
    loadGroup: loadGroup,
    /**
     * @member {module:lib/Dictionary} Dictionary
     */
    Dictionary: Dictionary,
    /**
     * @member {module:lib/Template} Template
     */
    Template: Template
};
