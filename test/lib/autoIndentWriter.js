/*global describe, it*/

"use strict";

var assert = require("assert"),
    os = require("os"),
    aiw = require("../../lib/autoIndentWriter");

var emptyGroup = function(_, g) {
    return g;
};

describe("autoIndentWriter", function() {

    describe("makeWriter", function() {
        it("should be empty when first made", function() {
            var w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            assert.strictEqual(w.toString(), "", "nothing written");
            assert.strictEqual(w.index(), 0, "nothing written");
            assert.strictEqual(w.lineWidth, 78, "correct line width");
            assert.strictEqual(w.eol, "\n", "correct end of line");
        });

        it("should be empty when first made with defaults", function() {
            var w = aiw.makeWriter();

            assert.strictEqual(w.toString(), "", "nothing written");
            assert.strictEqual(w.index(), 0, "nothing written");
            assert.strictEqual(w.lineWidth, aiw.NO_WRAP, "correct line width");
            assert.strictEqual(w.eol, os.EOL, "correct end of line");
        });
    });

    describe("write no indent, no wrap", function() {
        it("should contain all the text written", function() {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            n = w.write("some text,");
            assert.strictEqual(n, 10, "correct number of chars written");
            n = w.write("more text");
            assert.strictEqual(n, 9, "correct number of chars written");
            assert.strictEqual(w.toString(), "some text,more text", "correct text");
        });

        it("should contain all the text written including new lines", function() {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            n = w.write("some text,");
            assert.strictEqual(n, 10, "correct number of chars written");
            n = w.write(""); // this is OK
            assert.strictEqual(n, 0, "correct number of chars written");
            n = w.write("line 1\nline 2\n");
            assert.strictEqual(n, 14, "correct number of chars written");
            assert.strictEqual(w.toString(), "some text,line 1\nline 2\n", "correct text");
        });

        it("should allow new lines to be written independently and unify line endings", function() {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            n = w.write("some text");
            assert.strictEqual(n, 9, "correct number of chars written");
            n = w.write("\r");
            assert.strictEqual(n, 1, "correct number of chars written");
            assert.strictEqual(w.index(), 10, "correct index after write");
            n = w.write("line 1\r\nline 2\n");
            assert.strictEqual(n, 14, "correct number of chars written");
            assert.strictEqual(w.index(), 24, "correct index after write");
            assert.strictEqual(w.toString(), "some text\nline 1\nline 2\n", "correct text");
        });

        it("should count new lines correctly", function() {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\r\n"});

            n = w.write("line 1\nline 2\n");
            assert.strictEqual(n, 16, "correct number of chars written");
            assert.strictEqual(w.index(), 16, "correct index after write");
            assert.strictEqual(w.toString(), "line 1\r\nline 2\r\n", "correct text");
        });
    });

    describe("write with indent", function() {
        it("should indent text correctly", function () {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            n = w.write("if foo then");
            assert.strictEqual(n, 11, "correct number of chars written");
            w.pushIndentation("  ");
            n = w.write("\nstatement1");
            assert.strictEqual(n, 13, "correct number of chars written");
            n = w.write("\nstatement2");
            assert.strictEqual(n, 13, "correct number of chars written");
            w.popIndentation();
            n = w.write("\nend if\n");
            assert.strictEqual(n, 8, "correct number of chars written");
            assert.strictEqual(w.toString(), "if foo then\n  statement1\n  statement2\nend if\n", "correct text");
        });

        it("should indent text correctly multiple levels", function () {
            var n, w = aiw.makeWriter({lineWidth: 78, eol: "\n"});

            n = w.write("if foo then");
            assert.strictEqual(n, 11, "correct number of chars written");
            w.pushIndentation("  ");
            n = w.write("\nif bar then");
            w.pushIndentation("  ");
            n = w.write("\nstatement1");
            assert.strictEqual(n, 15, "correct number of chars written");
            n = w.write("\nstatement2");
            assert.strictEqual(n, 15, "correct number of chars written");
            w.popIndentation();
            n = w.write("\nend if");
            n = w.write("\nstatement3");
            assert.strictEqual(n, 13, "correct number of chars written");
            w.popIndentation();
            n = w.write("\nend if\n");
            assert.strictEqual(n, 8, "correct number of chars written");
            assert.strictEqual(w.toString(), "if foo then\n  if bar then\n    statement1\n    statement2\n  end if\n  statement3\nend if\n", "correct text");
        });
    });

    // xxx anchor
    // xxx wrap

});
