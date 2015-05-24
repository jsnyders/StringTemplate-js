/*global describe, it*/

"use strict";

var assert = require("assert"),
    Dictionary = require("../../lib/Dictionary");
    
describe("Dictionary", function() {

    describe("create dictionary", function() {
        it("should be empty.", function() {
            var d = new Dictionary({});

            assert.deepEqual(d.map, {}, "empty dictionary");
            assert.strictEqual(d.map.hasOwnProperty("defaultValue"), false, "no default");

            d = new Dictionary({a: "7"}, "5");
            assert.deepEqual(d.map, {a: "7"}, "has correct map");
            assert.strictEqual(d.defaultValue, "5", "has correct default");
        });
    });


    describe("get", function() {
        it("should get values in dictionary with no default.", function() {
            var d = new Dictionary({a: "A", b: 7, c: false, foo: Dictionary.DICT_KEY_VALUE });

            assert.strictEqual(d.get("a"), "A", "got correct value");
            assert.strictEqual(d.get("b"), 7, "got correct value - note group file could never put a number in a dictionary");
            assert.strictEqual(d.get("c"), false, "got correct value");
            assert.strictEqual(d.get("d"), undefined, "got correct value");
            assert.strictEqual(d.get("foo"), "foo", "got correct value");
        });

        it("should get values in dictionary with default.", function() {
            var d = new Dictionary({a: "A", b: "value b", c: true, d: null}, "def");

            assert.strictEqual(d.get("a"), "A", "got correct value");
            assert.strictEqual(d.get("b"), "value b", "got correct value");
            assert.strictEqual(d.get("c"), true, "got correct value");
            assert.strictEqual(d.get("d"), null, "got correct value");
            assert.strictEqual(d.get("foobar"), "def", "got correct value");
        });

        it("should get values in dictionary with default with value key.", function() {
            var d = new Dictionary({a: "A", b: "value b", c: true, d: null}, Dictionary.DICT_KEY_VALUE);

            assert.strictEqual(d.get("a"), "A", "got correct value");
            assert.strictEqual(d.get("foobar"), "foobar", "got correct value");
            assert.strictEqual(d.get("x"), "x", "got correct value");
        });
    });
});
