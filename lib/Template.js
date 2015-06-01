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
 * Constructor for Template objects. A template is a xxx
 * @param scope
 * @param owningGroup
 * @param renderer
 * @constructor
 */
function Template(scope, owningGroup, render, isAnonSubtemplate) {
    this.scope = scope;
    this.owningGroup = owningGroup;
    this.render = render;
    this.isAnonSubtemplate = isAnonSubtemplate || false;
}

// xxx add should be more like just passing function arguments to the template
Template.prototype.add = function(name, value) {
    if (typeof name === "number") {
        name = this.render.args[name].name;
        // xxx error checking
    }
    if (name.indexOf(".") >= 0) {
        throw new Error("Invalid character '.' in attribute name.");
    }
    // xxx render.args doesn't exist for raw templates
    if (this.render.args && !findInArray(this.render.args, function(i) { return i.name === name; })) {
        console.log("xxx ignoring arg " + name);
        // xxx todo throw 
        return;
    }
    this.scope[name] = value;
};

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
    // xxx at what point do we check that we have the right arguments in the context/scope
    // xxx does this go here or in runtime? Want to only do this once?
    // set all args, including defaults, and passthrough
    if (this.render.args) {
        for (i = 0; i < this.render.args.length; i++) {
            a = this.render.args[i];
            if (!this.scope.hasOwnProperty(a.name)) {
                this.scope[a.name] = a.default || null;
            }
        }
    }
    
    this.render(writer, renderContext);
};

module.exports = Template;
