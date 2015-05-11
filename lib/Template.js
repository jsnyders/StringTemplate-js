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

/**
 * xxx
 * @param scope
 * @param owningGroup
 * @param renderer
 * @constructor
 */
function Template(scope, owningGroup, render) {
    this.scope = scope;
    this.owningGroup = owningGroup;
    this.render = render;
}

// xxx add should be more like just passing function arguments to the template
Template.prototype.add = function(name, value) {
    if (typeof name === "number") {
        name = this.render.args[name].name;
        // xxx error checking
    }
    this.scope[name] = value;
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
    // xxx at what point do we check that we have the right arguments in the context/scope
    this.render(writer, renderContext);
};

module.exports = Template;
