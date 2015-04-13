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
 * autoIndentWriter.js
 * xxx todo figure out how to deal with writing to strings, files, streams etc.
 */
"use strict";

var os = require("os");

var SPACES = "                                                                                                              ";

var autoIndentWriterPrototype = {

    pushIndentation: function(indent) {
        this.indents.push(indent);
    },

    popIndentation: function() {
        return this.indents.pop();
    },

    pushAnchorPoint: function() {
        this.anchors.push(this.charPosition);
    },

    popAnchorPoint: function() {
        this.anchors.pop();
    },

    index: function() {
        return this.curPos;
    },

    write: function(str, wrap) {
        var i, line,
            n = 0,
            lines = str.split(/\r\n|\r|\n/);

        if (wrap) {
            n += this.writeWrap(wrap);
        }
        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            if (i > 0) {
                // this was a newline in the input str
                this.text += this.eol;
                n += this.eol.length;
                this.curLinePos = 0;
            }
            if ( this.curLinePos === 0 ) {
                n += this.indent();
            }
            n += line.length;
            this.curLinePos += n;
            this.curPos += n;
            this.text += line;
        }
        return n;
    },

    // why is this needed?
    writeSeparator: function(str) {
        return this.write(str);
    },

    writeWrap: function(wrap) {
        var n = 0;
        // xxx
        return n;
    },

    indent: function() {
        var i, indent, anchor, indentPos, diff,
            n = 0;

        for (i = 0; i < this.indents.length; i++) {
            indent = this.indents[i];
            n += indent.length();
            this.text += indent;
        }

        // If current anchor is beyond current indent width, indent to anchor
        // *after* doing indents (might tabs in there or whatever)
        indentPos = n;
        anchor = (this.anchors.length > 0 && this.anchors[this.anchors.length - 1]) || -1;
        if (anchor > indentPos ) {
            diff = anchor - indentPos;
            this.text += SPACES.substr(0, diff);
            n += diff;
        }

        this.curPos += n;
        this.curLinePos += n;
        return n;
    },

    toString: function() {
        return this.text;
    }
};

module.exports = {
    makeWriter: function(options) {
        var that = Object.create(autoIndentWriterPrototype);
        options = options || {};
        that.text = "";
        that.curPos = 0;
        that.curLinePos = 0;
        that.atStartOfLine = true;
        that.indents = [];
        that.anchors = [];
        that.eol = options.eol || os.EOL;
        return that;
    }
};
