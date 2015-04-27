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
 * for now this just appends to a string
 */
"use strict";

var os = require("os");

var SPACES = "                                                                                                              ";
var NO_WRAP = -1;

var autoIndentWriterPrototype = {

    /**
     * Increase the output indent.
     * @param indent a string of whitespace
     */
    pushIndentation: function(indent) {
        this.indents.push(indent);
    },

    /**
     * Decrease the output indent.
     * @returns the previous indent string
     */
    popIndentation: function() {
        return this.indents.pop();
    },

    /**
     * The current line position (at the time of this call) is pushed on the anchor stack.
     */
    pushAnchorPoint: function() {
        this.anchors.push(this.curLinePos);
    },

    /**
     * Remove the last anchor from the stack.
     */
    popAnchorPoint: function() {
        this.anchors.pop();
    },

    /**
     * Return the number of characters written to the output so far.
     * @returns number
     */
    index: function() {
        return this.curPos;
    },

    /**
     * Writes the given string to the output.
     * @param str the text string to write to the output
     * @param wrap optional end of line string to write before str if and only if the the line width is not NO_WRAP and
     *              the current line position is greater than the line width. See method writeWrap.
     * @returns {number} the number of characters actually written which may be greater than the str input because of indents.
     */
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
                this.curPos += this.eol.length;
                this.curLinePos = 0;
            }
            if ( this.curLinePos === 0 ) {
                n += this.indent();
            }
            this.text += line;
            n += line.length;
            this.curPos += line.length;
            this.curLinePos += line.length;
        }
        return n;
    },

    /**
     * Write a separator. Same as write except that wrapping cannot happen before a separator.
     * @param str the separator string to be written
     * @returns {number} The number of characters actually written.
     */
    writeSeparator: function(str) {
        return this.write(str);
    },

    /**
     * Write a line wrap/end of line string to the output if needed. The wrap parameter is expected
     * to have exactly one \n character. The simplest case is a single "\n". But any string of the form A\nB
     * with one \n is allowed and sometimes useful. For example "' +\n    '" would end the current string
     * add a + concatenation operator and start a new string on the next line.
     * @param wrap end of line string to write if and only if the the line width is not NO_WRAP and the
     *              current line position is greater than the  line width.
     * @returns {number} number of characters actually written
     */
    writeWrap: function(wrap) {
        var i, line,
            n = 0,
            lines = wrap.split(/\r\n|\r|\n/);

        if (this.lineWidth !== NO_WRAP && this.curLinePos >= this.lineWidth) {
            for (i = 0; i < lines.length; i++) {
                line = lines[i];
                if (i > 0) {
                    // this was a newline in the input str
                    this.text += this.eol;
                    n += this.eol.length;
                    this.curPos += this.eol.length;
                    this.curLinePos = 0;
                    n += this.indent();
                }
                this.text += line;
                n += line.length;
                this.curPos += line.length;
                this.curLinePos += line.length;
            }
        }
        return n;
    },

    /**
     * It is not necessary to call this method as it is called from write as needed.
     * This should only be called at the start of a new line. It will write the current indent if any.
     * If there is an anchor in effect and the indent position is not greater than the anchor position
     * then the indent is to the anchor position.
     * @returns {number} the number of characters actually written.
     */
    indent: function() {
        var i, indent, anchor, indentPos, diff,
            n = 0;

        for (i = 0; i < this.indents.length; i++) {
            indent = this.indents[i];
            this.text += indent;
            n += indent.length;
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

    /**
     * Return all the text written so far.
     * @returns {string}
     */
    toString: function() {
        return this.text;
    }
};

/**
 * Create an autoIndentWriter.
 * xxx details
 * @param options optional object with these optional properties:
 *      eol: end of line string. Defaults to the operating system default end of line sequence.
 *      lineWidth: the line character position beyond which wrapping may occur. Defaults to NO_WRAP.
 *
 * @returns {autoIndentWriter}
 */
function makeWriter(options) {
    var that = Object.create(autoIndentWriterPrototype);
    options = options || {};
    that.text = "";
    that.curPos = 0;
    that.curLinePos = 0;
    that.indents = [];
    that.anchors = [];
    that.lineWidth = options.lineWidth || NO_WRAP;
    that.eol = options.eol || os.EOL;
    return that;
}

module.exports = {
    NO_WRAP: NO_WRAP,

    makeWriter: makeWriter
};
