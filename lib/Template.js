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
 * This is the Template class.
 */
"use strict";
var isArray = require("util").isArray;
var util = require("./util");

// todo remove this once can rely on ES6
function findInArray(a, fn) {
    var i;
    for (i = 0; i < a.length; i++) {
        if (fn(a[i])) {
            return a[i];
        }
    }
    // return undefined
}
/**
 * Constructor for Template objects. A Template is a runtime instance of a template definition that
 * includes the scope in which the template is called and any actual arguments. All templates 
 * must be associated with a group. The Template constructor function should not be used directly.
 * To get a Template call Group.getTemplate.
 * 
 * Basic usage:
 * var myTemplate = myGroup.getTemplate("myTemplate");
 * myTemplate.setArgs(["first-arg-value", "second-arg-value"]);
 * myTemplate.write(writer);
 * console.log(writer.toString());
 * 
 * For raw templates use add method rather than setArgs.
 * 
 * @param scope Empty object with prototype chain that establishes the template scope
 * @param owningGroup The group that created this template. This may not be the group that template is defined in.
 * @param render The compiled template. A function called by the write method that renders the template to the 
 * writer according to the template definition.
 * @param isAnonSubtemplate optional set to true if the template is a anonymous sub template
 * @constructor
 */
function Template(scope, owningGroup, render, isAnonSubtemplate) {
    this.scope = scope;
    this.owningGroup = owningGroup;
    this.render = render;
    this.argsPassThrough = false;
    this.isAnonSubtemplate = isAnonSubtemplate || false;
}

/**
 * Set the arguments to this template. The arguments can be given in an array
 * or in an object. Using an array corresponds to calling with positional arguments:
 *     template(arg1, arg2)
 * Using an object corresponds to calling with named parameters
 *     template(a=arg1, b=arg2)
 * @param args array of object of arguments
 * @param passThrough optional. Typically only for internal use. This corresponds to the ... call syntax.  
 */
Template.prototype.setArgs = function(args, passThrough) {
    var i, len, name, value;

    function matchName(i) {
        return i.name === name;
    }

    if (!this.render.args) {
        throw new Error("Use add method for raw templates");
    }
    if (isArray(args)) {
        len = args.length;
        if (len > this.render.args.length) {
            // xxx consider how to get source line, column
            this.owningGroup.reportRuntimeError(new Error("Too many actual arguments. Expected " + this.render.args.length + " but " + len + " supplied."));
            len = this.render.args.length;
        }
        for (i = 0; i < len; i++) {
            name = this.render.args[i].name;
            value = args[i];
            this.scope[name] = value;
        }
    } else {
        // must be an object
        for (name in args) {
            if (args.hasOwnProperty(name)) {
                if (name.indexOf(".") >= 0) {
                    this.owningGroup.reportRuntimeError(new Error("Invalid character '.' in attribute name. Invalid name '" + name + "'."));
                } else {
                    value = args[name];
                    if (!findInArray(this.render.args, matchName)) {
                        this.owningGroup.reportRuntimeError(new Error("No such named argument '" + name + "'."));
                    } else {
                        this.scope[name] = value;
                    }
                }
            }
        }
    }

    if (passThrough) {
        this.argsPassThrough = true;
    }
};

/**
 * Adds attributes as arguments to this template. Typically only used for raw templates.
 * @param name
 * @param value
 */
Template.prototype.add = function(name, value) {
    // todo consider if this is not a raw template verifying that name is one of the formal args
    if (name.indexOf(".") >= 0) {
        throw new Error("Invalid character '.' in attribute name.");
    }
    this.scope[name] = value;
};

/**
 * For internal runtime use only
 * @param scope
 */
Template.prototype.setScope = function(scope) {
    var oldScope = this.scope;
    this.scope = Object.create(scope);
    // copy properties
    util.copyProperties(oldScope, this.scope);
};

/**
 * Clear all attributes added to a template to prepare it to be used again
 */
Template.prototype.clear = function() {
    var p;
    for (p in this.scope) {
        if (this.scope.hasOwnProperty(p)) {
            delete this.scope[p];
        }
    }
};

/**
 * xxx
 * @param writer
 * @param renderContext
 */
Template.prototype.write = function(writer, renderContext) {
    var i, a;
    // xxx does this go here or in runtime? Want to only do this once?

    // set all args, including defaults, and passthrough
    if (this.render.args) {
        for (i = 0; i < this.render.args.length; i++) {
            a = this.render.args[i];
            if (!this.scope.hasOwnProperty(a.name)) {
                // the formal argument a.name has not been given a value
                // if argsPassThrough (...) has been specified don't let this argument name hide attributes in parent scopes 
                // otherwise set the formal arg to its default if it has one otherwise null
                if (!this.argsPassThrough) {
                    this.scope[a.name] = a.default || null;
                }
            }
        }
    }
    this.render(writer, renderContext);
};

module.exports = Template;
