/*global describe, it*/

"use strict";

var assert = require("assert"),
    ar = require("../../lib/javaScriptAttributeRenderer");


describe("javaScriptAttributeRenderer", function() {

    describe("no format", function() {
        it("should handle booleans as strings", function() {
            assert.strictEqual(ar(true, null), "true", "boolean  OK");
        });

        it("should handle strings", function() {
            assert.strictEqual(ar("text\r\n\t\".", "none"), 'text\r\n\t".', "string returned as is OK");
        });

        it("should handle numbers as strings", function() {
            assert.strictEqual(ar(99, null), '99', "string with quotes OK");
        });
    });

    describe("string", function() {
        it("should handle simple strings", function() {
            assert.strictEqual(ar("simple string", "string"), "simple string", "simple string OK");
        });

        it("should handle strings quotes", function() {
            assert.strictEqual(ar("with \"quotes\"", "string"), 'with \\"quotes\\"', "string with quotes OK");
        });

        it("should handle strings backslash escapes", function() {
            assert.strictEqual(ar("with escapes \r\n\f\t\b\\.", "string"), "with escapes \\r\\n\\f\\t\\b\\\\.", "string with backslash escapes OK");
            assert.strictEqual(ar("with escapes \a.", "string"), "with escapes a.", "string with unnecessary backslash escape OK");
        });

        it("should handle strings with Unicode escapes", function() {
            assert.strictEqual(ar("with Unicode escapes \u0010 \u0080 \u0601.", "string"), "with Unicode escapes \\u0010 \\u0080 \\u0601.", "string with Unicode escapes OK");
        });
    });

    describe("key", function() {
        it("should handle identifiers", function() {
            assert.strictEqual(ar("id", "key"), "id", "identifier OK");
        });

        it("should handle non-identifiers", function() {
            assert.strictEqual(ar("id is not an identifier", "key"), '"id is not an identifier"', "non-identifier OK");
            assert.strictEqual(ar("{:}", "key"), '"{:}"', "non-identifier OK");
            assert.strictEqual(ar(7, "key"), '"7"', "non-identifier OK");
            assert.strictEqual(ar("", "key"), '""', "non-identifier OK");
        });
    });

    // xxx check for invalid format

});
