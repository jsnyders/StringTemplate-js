/*global describe, it*/

"use strict";

var assert = require("assert"),
    path = require("path"),
    Dictionary = require("../../lib/Dictionary"),
    st = require("../../lib/stRuntime");

var emptyGroup = function(_, g) {
    return g;
};

var getST = function() {
    var internal;
    st.loadGroup(function(st, _) {
        internal = st;
    });
    return internal;
};

describe("stRuntime", function() {

    // xxx internal write
    // xxx internal prop

    describe("internal Dictionary", function() {
        // NOTE this relies on the existence of testGroup_stg.js 
        it("should expose the Dictionary class.", function() {
            var st = getST();

            assert.strictEqual(st.Dictionary, Dictionary, "It is a dictionary class");
        });
    });

    describe("internal loadImport", function() {
        // NOTE this relies on the existence of testGroup_stg.js 
        it("should return an loaded group.", function() {
            var st = getST();
            var g = st.loadImport(path.dirname(path.dirname(module.filename)), "testGroup.stg");
            // test to see if it looks like a group
            assert.strictEqual(typeof g.getTemplate, "function", "has getTemplate function");
        });
    });

    describe("internal prop dictionary access", function() {
        it("should return dictionary key value.", function() {
            // xxx
        });
    });

    describe("internal built-in function first", function() {
        it("should return first element of an array.", function() {
            var first = getST().fn.first,
                a = ["foo", "bar"];

            assert.strictEqual(first([1,2,3]), 1, "returned first element");
            assert.strictEqual(first([false]), false, "returned first element");
            assert.strictEqual(first(a), "foo", "returned first element");
            assert.deepEqual(a, ["foo", "bar"], "original not changed");
        });

        it("should return empty array if input is empty.", function() {
            var first = getST().fn.first;

            assert.deepEqual(first([]), [], "returned empty array");
        });

        it("should return null if input is null", function() {
            var first = getST().fn.first;

            assert.strictEqual(first(null), null, "returned null input");
            assert.strictEqual(first(), undefined, "returned undefined input");
        });

        it("should return input if input is scalar", function() {
            var first = getST().fn.first;

            assert.strictEqual(first("foo"), "foo", "returned scalar input");
            assert.strictEqual(first(7), 7, "returned scalar input");
            assert.strictEqual(first(false), false, "returned scalar input");
        });

    });

    describe("internal built-in function last", function() {
        it("should return first element of an array.", function() {
            var last = getST().fn.last,
                a = ["foo", "bar"];

            assert.strictEqual(last([1,2,3]), 3, "returned last element");
            assert.strictEqual(last([false]), false, "returned last element");
            assert.strictEqual(last(a), "bar", "returned last element");
            assert.deepEqual(a, ["foo", "bar"], "original not changed");
        });

        it("should return empty array if input is empty.", function() {
            var last = getST().fn.last;

            assert.deepEqual(last([]), [], "returned empty array");
        });

        it("should return null if input is null", function() {
            var last = getST().fn.last;

            assert.strictEqual(last(null), null, "returned null input");
            assert.strictEqual(last(), undefined, "returned undefined input");
        });

        it("should return input if input is scalar", function() {
            var last = getST().fn.last;

            assert.strictEqual(last("foo"), "foo", "returned scalar input");
            assert.strictEqual(last(7), 7, "returned scalar input");
            assert.strictEqual(last(false), false, "returned scalar input");
        });

    });

    describe("internal built-in function rest", function() {
        it("should return all but first element of an array.", function() {
            var rest = getST().fn.rest,
                a = ["foo", "bar", "baz"];

            assert.deepEqual(rest([1,2,3]), [2,3], "returned rest");
            assert.deepEqual(rest([true, false]), [false], "returned rest");
            assert.deepEqual(rest(a), ["bar", "baz"], "returned rest");
            assert.deepEqual(a, ["foo", "bar", "baz"], "original not changed");
        });

        it("should return empty array if input is empty or has only one element.", function() {
            var rest = getST().fn.rest;

            assert.deepEqual(rest([]), [], "returned empty array");
            assert.deepEqual(rest(["x"]), [], "returned empty array");
        });

        it("should return null if input is null or scalar", function() {
            var rest = getST().fn.rest;

            assert.strictEqual(rest(null), null, "returned null for null input");
            assert.strictEqual(rest(), null, "returned null for undefined input");
            assert.strictEqual(rest("foo"), null, "returned null for scalar input");
            assert.strictEqual(rest(7), null, "returned null for scalar input");
            assert.strictEqual(rest(false), null, "returned null for scalar input");
        });

    });

    describe("internal built-in function trunc", function() {
        it("should return all but first element of an array.", function() {
            var trunc = getST().fn.trunc,
                a = ["foo", "bar", "baz"];

            assert.deepEqual(trunc([1,2,3]), [1,2], "returned trunc");
            assert.deepEqual(trunc([true, false]), [true], "returned trunc");
            assert.deepEqual(trunc(a), ["foo", "bar"], "returned trunc");
            assert.deepEqual(a, ["foo", "bar", "baz"], "original not changed");
        });

        it("should return empty array if input is empty or has only one element.", function() {
            var trunc = getST().fn.trunc;

            assert.deepEqual(trunc([]), [], "returned empty array");
            assert.deepEqual(trunc(["x"]), [], "returned empty array");
        });

        it("should return null if input is null or scalar", function() {
            var trunc = getST().fn.trunc;

            assert.strictEqual(trunc(null), null, "returned null for null input");
            assert.strictEqual(trunc(), null, "returned null for undefined input");
            assert.strictEqual(trunc("foo"), null, "returned null for scalar input");
            assert.strictEqual(trunc(7), null, "returned null for scalar input");
            assert.strictEqual(trunc(false), null, "returned null for scalar input");
        });

    });

    describe("internal built-in function length", function() {
        it("should return length of an array.", function() {
            var length = getST().fn.length,
                a = ["foo", "bar", "baz"],
                b = [];

            b[5] = 9;
            assert.strictEqual(length([1,2,3]), 3, "returned length");
            assert.strictEqual(length(b), 6, "returned length");
            assert.strictEqual(length(a), 3, "returned length");
            assert.strictEqual(length([]), 0, "returned length");
        });

        it("should return 0 if input is null or undefined", function() {
            var length = getST().fn.length;

            assert.strictEqual(length(null), 0, "returned 0 for null input");
            assert.strictEqual(length(), 0, "returned 0 for undefined input");
        });

        it("should return 1 if input is scalar", function() {
            var length = getST().fn.length;
    
            assert.strictEqual(length("foo"), 1, "returned 1 for scalar input");
            assert.strictEqual(length(7), 1, "returned 1 for scalar input");
            assert.strictEqual(length(false), 1, "returned 1 for scalar input");
            assert.strictEqual(length({"a":1, "b":2}), 1, "returned 1 for scalar input");
        });

    });

    describe("internal built-in function reverse", function() {
        it("should return all but first element of an array.", function() {
            var reverse = getST().fn.reverse,
                a = ["foo", "bar", "baz"];

            assert.deepEqual(reverse([0,1,2,3]), [3,2,1,0], "returned reverse");
            assert.deepEqual(reverse([true, false]), [false,true], "returned reverse");
            assert.deepEqual(reverse(a), ["baz", "bar", "foo"], "returned reverse");
            assert.deepEqual(a, ["foo", "bar", "baz"], "original not changed");
            assert.deepEqual(reverse(["x"]), ["x"], "returned reverse");
        });

        it("should return empty array if input is empty.", function() {
            var reverse = getST().fn.reverse;

            assert.deepEqual(reverse([]), [], "returned empty array");
        });

        it("should return input if input is scalar", function() {
            var reverse = getST().fn.reverse;

            assert.strictEqual(reverse("foo"), "foo", "returned scalar input");
            assert.strictEqual(reverse(7), 7, "returned scalar input");
            assert.strictEqual(reverse(false), false, "returned scalar input");
            assert.deepEqual(reverse({"a":1, "b":2}), {"a":1, "b":2}, "returned scalar input");
            assert.strictEqual(reverse(null), null, "returned scalar input");
        });

    });

    describe("internal built-in function strip", function() {
        it("should return all array without nulls.", function() {
            var strip = getST().fn.strip,
                a = ["foo", "bar", "baz", null],
                b = [];

            b[5] = "a";
            assert.deepEqual(strip([0,null,1,null]), [0, 1], "returned without nulls");
            assert.deepEqual(strip([0,1,2]), [0, 1, 2], "returned without nulls (there were none)");
            assert.deepEqual(strip([null, true, false]), [true, false], "returned without nulls");
            assert.deepEqual(strip(a), ["foo", "bar", "baz"], "returned without nulls");
            assert.deepEqual(a, ["foo", "bar", "baz", null], "original not changed");
            assert.deepEqual(strip(b), ["a"], "returned without nulls (or undefined)");
        });

        it("should return empty array if input is empty.", function() {
            var strip = getST().fn.strip;

            assert.deepEqual(strip([]), [], "returned empty array");
        });

        it("should return null if input is null or scalar", function() {
            var strip = getST().fn.strip;

            assert.strictEqual(strip("foo"), "foo", "returned scalar input");
            assert.strictEqual(strip(7), 7, "returned scalar input");
            assert.strictEqual(strip(false), false, "returned scalar input");
            assert.deepEqual(strip({"a":1, "b":2}), {"a":1, "b":2}, "returned scalar input");
        });

    });

    describe("internal built-in function strlen", function() {
        it("should return length of string.", function() {
            var strlen = getST().fn.strlen;

            assert.strictEqual(strlen("foobar"), 6, "returned length");
            assert.strictEqual(strlen(""), 0, "returned length");
        });

        it("should throw if input is not a string.", function() {
            var strlen = getST().fn.strlen;

            assert.throws(function() {
                strlen(null);
            }, /strlen/, "throws error");
            assert.throws(function() {
                strlen(7);
            }, /strlen/, "throws error");
            assert.throws(function() {
                strlen(true);
            }, /strlen/, "throws error");
        });

    });

    describe("internal built-in function trim", function() {
        it("should return length of string.", function() {
            var trim = getST().fn.trim;

            assert.strictEqual(trim("foobar"), "foobar", "returned trimmed string");
            assert.strictEqual(trim("  foo bar\nbaz\t"), "foo bar\nbaz", "returned trimmed string");
            assert.strictEqual(trim(""), "", "returned trimmed string");
        });

        it("should throw if input is not a string.", function() {
            var trim = getST().fn.trim;

            assert.throws(function() {
                trim(null);
            }, /trim/, "throws error");
            assert.throws(function() {
                trim(7);
            }, /trim/, "throws error");
            assert.throws(function() {
                trim(true);
            }, /trim/, "throws error");
        });
    });

});
