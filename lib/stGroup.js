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
 * This is the prototype stGroup object. It is used to make specific groups
 */
/**
 * @module stGroup
 */
"use strict";

var Template = require("./Template"),
    //isArray = require("util").isArray,
    aiw = require("./autoIndentWriter"),
    errors = require("./errors"),
    util = require("./util");

function makeInitialScope(group) {
    var i, initialScope, curGroup,
        curScope = null,
        orderedGroups = [];

    function orderGroups(curGroup) {
        var i;
        for (i = curGroup.imports.length - 1; i >= 0;  i--) {
            orderGroups(curGroup.imports[i]);
        }
        orderedGroups.push(curGroup);
    }

    orderGroups(group);

    for (i = 0; i < orderedGroups.length ; i++) {
        curGroup = orderedGroups[i];
        if (Object.keys(curGroup.dictionaries).length > 0) {
            if (curScope) {
                curScope = Object.create(curScope);
            } else {
                curScope = {};
            }
            util.copyProperties(curGroup.dictionaries, curScope);
        }
    }

    if (curScope) {
        initialScope = Object.create(curScope);
    } else {
        initialScope = {};
    }
    return initialScope;
}

/**
 * @mixin
 */
var groupPrototype = {
    /**
     * Simplified interface to rendering a template. Alternative to calling getTemplate and then setArgs 
     * and write on the template.
     * 
     * @param name {string} template name
     * @param args {array|object} array or map of the arguments to pass to the template. 
     * @param writer optional writer to use the default is to use an autoIndentWriter.
     * @returns {string} the rendered template
     */
    render: function(name, args, writer) {
        var t;

        if (!writer) {
            writer = aiw.makeWriter();
        }
        t = this.getTemplate(name);
/*xxx        if (t.render.args.length === 0) {
            if (isArray(args) || !typeof args === "object") {
                throw new Error("Args must be an object for a raw template");
            }
            for (attr in args) {
                if (args.hasOwnProperty(attr)) {
                    t.add(args);
                }
            }
        } else { */
            t.setArgs(args);
//xxx        }
        t.write(writer);
        return writer.toString();
    },

    /**
     * Add a named dictionary to the group. 
     * 
     * @param name name of dictionary
     * @param dict Dictionary object
     */
    addDictionary: function(name, dict) {
        this.dictionaries[name] = dict;
    },

    /**
     * Add import 
     * @param group
     */
    addImport: function(group) {
        this.imports.push(group);
    },

    /**
     * Add a named template render function
     * @param name
     * @param templateFn
     */
    addTemplate: function(name, templateFn) {
        this.templates[name] = templateFn;
    },

    /**
     *
     * @param aliasName
     * @param targetName
     */
    addTemplateAlias: function(aliasName, targetName) {
        var tf = this.templates[targetName]; // don't use lookupTemplateFn the target must be in the same group

        if (!tf) {
            // xxx not sure if this should throw or go through reportRuntimeError
            throw Error("No such template '" + targetName + "'.");
        }
        this.templates[aliasName] = tf;
    },

    /*
     * Look for a template function named 'name' in this group and if not found look in each
     * imported group in order. This ends up doing a depth first search of the import tree.
     */
    lookupTemplateFn: function(name) {
        var i, g,
            tf = this.templates[name];
        if (tf) {
            return tf;
        } // else
        for (i = 0; i < this.imports.length; i++) {
            g = this.imports[i];
            tf = g.lookupTemplateFn(name);
            if (tf) {
                return tf;
            }
        }
        return null;
    },

    /**
     * getTemplate
     * Returns a template instance for the given name.
     *
     * While processing a template, templates are always looked up starting
     * at the template's owning group and since the templates returned have the
     * same owning group used to do the lookup all templates are looked up
     * starting at the group on which the initial getTemplate call was made.
     *
     * @param name template name. Template names may include / path characters. These are just part of the name.
     * @param parentScope optional parent scope - for internal use only
     * @returns {Template} Template instance
     */
    getTemplate: function(name, parentScope) {
        var template, scope, trf;

        if (name.substr(0, 1) !== "/") {
            name = "/" + name;
        }
        trf = this.lookupTemplateFn(name);

        if (!trf) {
            this.reportRuntimeError(Error("No such template '" + name + "'."));
        }

        // turn this template function into a template object
        if (parentScope) {
            scope = Object.create(parentScope);
        } else {
            scope = makeInitialScope(this);
        }
        template = new Template(scope, this, trf);
        if (parentScope) {
            template._hasParentScope = true;
        }
        return template;
    },

    reportRuntimeError: function(location, type, arg1, arg2) {
        var error, message, locPrefix;
        location = location || {};
        switch (type) {
            case errors.st.ATTRIBUTE_NOT_FOUND:
                message = "Attribute '" + arg2 + "' not found.";
                break;
            case errors.st.PROPERTY_NOT_FOUND:
                message = "Property '" + arg2 + "' not found.";
                break;
            // xxx more
            default:
                message = "Unknown error.";
        }
        // xxx would be nice if location included a template call stack
        error = new errors.STRuntimeMessage(type, message, location.file, location.line, location.column);
        error.arg1 = arg1;
        error.arg2 = arg2;
        if (this.errorListener) {
            this.errorListener(error);
        } else {
            locPrefix = "";
            if (location.file) {
                locPrefix += "(" + location.file;
                if (location.line) {
                    locPrefix += "," + location.line;
                    if (location.column) {
                        locPrefix += "," + location.column;
                    }
                }
                locPrefix += "): ";
            }
            console.log(locPrefix + "Runtime error: " + message);
        }
    },

    /**
     * Set the error listener which is called for any runtime errors
     * @param listener  function(Error)
     */
    setErrorListener: function(listener) {
        this.errorListener = listener;
    },

    /**
     * Get the error listener
     * @param listener function(Error)
     */
    getErrorListener: function(listener) {
        this.errorListener = listener;
    },

    /**
     * Register a rendering function that will be called to render attribute values
     * of the specified type. The render function is called with:
     *   the value to be rendered,
     *   format string, which is the value of the template expression format option or null if there is no format option,
     *   the renderContext that is passed to template.write This can hold context information such as the locale, output encoding
     *      or anything else needed by the renderer functions
     * the render function must return a string representation of the value.
     *
     * @param typeName one of: array, date, error, function, number, object, regexp, string, or constructor function name e.g. MyThing
     *          String Template iterates over arrays so it is very unlikely that an array is ever rendered
     *          function and regexp are probably not very useful or likely
     * @param renderer function(value, formatString, renderContext) returns string
     */
    registerAttributeRenderer: function(typeName, renderer) {
        this.renderers[typeName] = renderer;
    },

    /**
     * Return a rendering function for the given type name. See registerAttributeRenderer.
     * @param typeName
     * @returns {function|null}
     */
    getAttributeRenderer: function(typeName) {
        return this.renderers[typeName] || null;
    },

    /**
     * Register a model adaptor. The model adaptor is responsible for accessing properties of instances of the given type.
     *
     * @param typeName type or class name to handle property access for
     * @param adaptor function(object, propertyName) returns value of property. If the property does not exist return undefined.
     */
    registerModelAdaptor: function(typeName, adaptor) {
        this.modelAdaptors[typeName] = adaptor;
    },

    /**
     * Return a modelAdaptor function for the given type name. See registerModelAdaptor.
     * @param typeName
     * @returns {function|null}
     */
    getModelAdaptor: function(typeName) {
        return this.modelAdaptors[typeName] || null;
    }

};

module.exports = groupPrototype;
