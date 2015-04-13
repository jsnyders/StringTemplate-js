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
"use strict";

var templatePrototype = {
    // xxx add should be more like just passing function arguments to the template
    add: function(name, value) {
        this.scope[name] = value;
    },
    /**
     * xxx
     * @param writer
     * @param renderContext
     */
    write: function(writer, renderContext) {
        // xxx at what point do we check that we have the right arguments in the context/scope
        this.render(this.scope, writer);
    }
};

function copyProperties(src, dst) {
    var p;
    for (p in src) {
        if (src.hasOwnProperty(p)) {
            dst[p] = src[p];
        }
    }
}

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
            copyProperties(curGroup.dictionaries, curScope);
        }
    }

    if (curScope) {
        initialScope = Object.create(curScope);
    } else {
        initialScope = {};
    }
    return initialScope;
}

var groupPrototype = {
    TEMPLATE_FILE_EXTENSION: ".st",
    GROUP_FILE_EXTENSION: ".stg",

    /**
     *
     * @param name
     * @param dict
     */
    addDictionary: function(name, dict) {
        this.dictionaries[name] = dict;
    },

    /**
     *
     * @param group
     */
    addImport: function(group) {
        this.imports.push(group);
    },

    /**
     *
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
     * @returns {template-instance}
     */
    getTemplate: function(name, parentScope) {
        var template, scope,
            trf = this.lookupTemplateFn(name);

        if (!trf) {
            // xxx this should go through an error handler of some kind
            throw Error("No such template '" + name + "'.");
        }

        // turn this template function into a template object
        template = Object.create(templatePrototype);
        if (parentScope) {
            scope = Object.create(parentScope);
        } else {
            scope = makeInitialScope(this);
        }
        template.scope = scope;
        template.owningGroup = this;
        template.render = trf;
        return template;
    }

    // xxx
    // registerRender
    // registerModelAdaptor

};

module.exports = groupPrototype;
