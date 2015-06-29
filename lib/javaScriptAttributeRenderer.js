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

var ident = /[a-zA-Z_$][a-zA-Z0-9_$]*/;

var reservedWords = {
    "delete": true,
    "default": true,
    "else": true,
    "if": true,
    "new": true,
    "this": true
    // more ???
};

function escapeString(str)
{
    // this should be much better
    return str.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}

function attributeRenderer(value, formatName, context) {
    var quoteIt = false;
    
    value = value + ""; // force it to be a string just in case

    if (formatName === null || formatName ==="none") {
        return value;
    } else if (formatName === "string") {
        return escapeString(value + "");
    } else if (formatName === "key") {
        if (reservedWords.hasOwnProperty(value)) {
            quoteIt = true;
        } else {
            if (!ident.test(value)) {
                quoteIt = true;
            }
        }
        if (quoteIt) {
            return "\"" + escapeString(value) + "\"";
        } // else
        return value;
    } else {
        throw new Error("Unsupported format name"); // xxx
    }
}

module.exports = attributeRenderer;
