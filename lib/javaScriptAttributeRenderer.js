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

"use strict";

// this is more restrictive than it should be since many Unicode characters are allowed in identifier names
var identifierName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

var reservedWords = {
    "abstract": 1,
    "boolean": 1,
    "break": 1,
    "byte": 1,
    "case": 1,
    "catch": 1,
    "char": 1,
    "class": 1,
    "const": 1,
    "continue": 1,
    "debugger": 1,
    "default": 1,
    "delete": 1,
    "do": 1,
    "double": 1,
    "else": 1,
    "enum": 1,
    "export": 1,
    "extends": 1,
    "false": 1,
    "final": 1,
    "finally": 1,
    "float": 1,
    "for": 1,
    "function": 1,
    "goto": 1,
    "if": 1,
    "implements": 1,
    "import": 1,
    "in": 1,
    "instanceof": 1,
    "int": 1,
    "interface": 1,
    "long": 1,
    "native": 1,
    "new": 1,
    "null": 1,
    "package": 1,
    "private": 1,
    "protected": 1,
    "public": 1,
    "return": 1,
    "short": 1,
    "static": 1,
    "super": 1,
    "switch": 1,
    "synchronized": 1,
    "this": 1,
    "throw": 1,
    "throws": 1,
    "transient": 1,
    "true": 1,
    "try": 1,
    "typeof": 1,
    "var": 1,
    "void": 1,
    "volatile": 1,
    "while": 1,
    "with": 1
};

// escapeString adapted from json2.js
var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };

function escapeString(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then it needs no escaping.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    escapable.lastIndex = 0;
    return escapable.test(string) ?
        string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        })
        : string;
}

//function attributeRenderer(value, formatName, context) {
function attributeRenderer(value, formatName) {
    value = value + ""; // force it to be a string just in case

    if (formatName === null || formatName ==="none") {
        return value;
    } else if (formatName === "string") {
        return escapeString(value);
    } else if (formatName === "key") {
        // this check for reserved words is to be extra safe in case running in ECMAScript 3 
        if (reservedWords.hasOwnProperty(value) || !identifierName.test(value)) {
            return "\"" + escapeString(value) + "\"";
        } // else
        return value;
    } else {
        throw new Error("Unsupported format name"); // xxx
    }
}

module.exports = attributeRenderer;
