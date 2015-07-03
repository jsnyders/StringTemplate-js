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
 * group.js
 * Context information used during compiling templates to a group JavaScript file.
 */
"use strict";

// These are the built-in functions supported by the runtime.
// todo THINK it may be possible to extend this set at runtime so it would require a way to add to this list during compiling
var functions = ["first", "length", "strlen", "last", "rest", "reverse", "trunc", "strip", "trim"],
    fnMap = {};
functions.forEach(function(fn) { fnMap[fn] = true; });

// These are the built-in options supported by the runtime.
var exprOptions = ["separator", "format", "null", "wrap", "anchor"],
    exprOptionsMap = {};
exprOptions.forEach(function(opt) { exprOptionsMap[opt] = true; });

var groupPrototype = {
    addTemplate: function (def) {
        var name = this.groupFolder + "/" + def.name;
        this.templates[name] = def;
        return null;
    },
    addRegion: function (def) {
        var name = "@" + def.enclosingTemplate + "." + def.name;
        this.templates[name] = def;
        return null;
    },
    addTemplateAlias: function(alias, target) {
        this.aliases[alias] = target;
        return null;
    },
    addImports: function(file) {
        this.imports.push(file);
        return null;
    },
    addDictionary: function(dict) {
        this.dictionaries[dict.name] = dict;
        return null;
    },
    isFunction: function (name) {
        return name in fnMap;
    },
    isValidOption: function(name) {
        return name in exprOptionsMap;
    },
    defaultOptionValue: function(name) {
        if (name === "anchor") {
            return {
                type: "BOOLEAN",
                value: true
            };
        } else if (name === "wrap") {
            return {
                type: "STRING",
                value: "\n"
            };
        }
        return null;
    }
};

module.exports = {
    TEMPLATE_FILE_EXTENSION: ".st",
    GROUP_FILE_EXTENSION: ".stg",
    DEFAULT_START_DELIMITER: "$",
    DEFAULT_STOP_DELIMITER: "$",
    makeGroup: function(groupFolder, fileName, raw) {
        var that = Object.create(groupPrototype);
        that.groupFolder = groupFolder;
        that.fileName = fileName;
        that.raw = raw ? true : false;
        that.templates = {};
        that.aliases = {};
        that.imports = [];
        that.dictionaries = {};
        return that;
    }
};
