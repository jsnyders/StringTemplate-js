/*global describe, it*/

"use strict";

var assert = require("assert"),
    Template = require("../../lib/Template");
    
var group = {};

var render = function(w, c) { return 0; };
render.args = [
    { name: "arg1" },
    { name: "arg2", default: "def" }
];

describe("Template", function() {

    describe("create template", function() {
        it("should be empty.", function() {
            var t = new Template({}, group, render);

            assert.deepEqual(t.scope, {}, "empty scope");
            assert.strictEqual(t.owningGroup, group, "correct group");
            assert.strictEqual(t.render, render, "correct render function");
            assert.strictEqual(t.isAnonSubtemplate, false, "not an anonymous sub template by default");
            assert.strictEqual(t.argsPassThrough, false, "starts with args pass through false");
        });

        it("should be empty anonymous sub template.", function() {
            var t = new Template({}, group, render, true);

            assert.deepEqual(t.scope, {}, "empty scope");
            assert.strictEqual(t.owningGroup, group, "correct group");
            assert.strictEqual(t.render, render, "correct render function");
            assert.strictEqual(t.isAnonSubtemplate, true, "is an anonymous sub template");
            assert.strictEqual(t.argsPassThrough, false, "starts with args pass through false");
        });
    });

    describe("setArgs", function() {
        it("should contain any attributes added by position.", function () {
            var t = new Template({}, group, render);

            t.setArgs(["foo", "bar"]);
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");
        });

        it("should contain any attributes added by name.", function () {
            var t = new Template({}, group, render);

            t.setArgs({arg1: "foo", arg2: "bar"});
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");
        });

        it("should throw an error if attribute name is invalid.", function() {
            var t = new Template({}, group, render);

            // Note the reference impl only checks that the name doesn't contain a "."
            // I think it should validate that the name is an ID.
            assert.throws(function() {
                t.setArgs({"foo.bar": "value1"});
            }, /Invalid character.*foo\.bar/, "throws error");
        });

        it("should report a runtime error if name doesn't match a formal arg.", function () {
            var rterr,
                t = new Template({}, {
                    reportRuntimeError: function(err) {
                        rterr = err; 
                    }
                }, render);

            t.setArgs({arg1: "foo", argX: "bar"});
            assert.ok(/No such named argument.*argX/.test(rterr), "got expected runtime error");
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
        });

        it("should report a runtime error if two many args.", function () {
            var rterr,
                t = new Template({}, {
                    reportRuntimeError: function(err) {
                        rterr = err;
                    }
                }, render);

            t.setArgs(["foo", "bar", "baz"]);
            assert.ok(/Too many actual arguments.*2/.test(rterr), "got expected runtime error");
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
        });
        // xxx test OK to set fewer
        // xxx test pass through
        // xxx test defaults, pass through after write
    });

    describe("add", function() {
        it("should contain any attributes added.", function() {
            var t = new Template({}, group, render);

            t.add("foo", "value1");
            t.add("bar", "value2");
            assert.strictEqual(t.scope.foo, "value1", "got value added");
            assert.strictEqual(t.scope.bar, "value2", "got value added");
        });

        it("should hide any attributes with same name in parent scope.", function() {
            var parent = { foo: "base1", bar:"base2"},
                t = new Template(Object.create(parent), group, render);

            assert.deepEqual(t.scope, {}, "empty scope");
            assert.strictEqual(t.scope.foo, "base1", "got value from parent scope");
            t.add("foo", "value1");
            assert.strictEqual(t.scope.foo, "value1", "got value added");
            assert.strictEqual(t.scope.bar, "base2", "got value from parent scope");
        });

        it("should throw an error if attribute name is invalid.", function() {
            var t = new Template({}, group, render);

            // Note the reference impl only checks that the name doesn't contain a "."
            // I think it should validate that the name is an ID.
            assert.throws(function() {
                t.add("foo.bar", "value1");
            }, /Invalid character.*foo\.bar/, "throws error");
        });
    });

    describe("clear", function() {
        it("should remove all attributes added.", function() {
            var t = new Template({}, group, render);

            assert.strictEqual(t.scope.foo, undefined, "scope is empty");
            t.add("foo", "value1");
            t.add("bar", "value2");
            assert.strictEqual(t.scope.foo, "value1", "got value added");
            assert.strictEqual(t.scope.bar, "value2", "got value added");
            t.clear();
            assert.deepEqual(t.scope, {}, "empty scope after clear");
            assert.strictEqual(t.scope.foo, undefined, "scope is empty after clear");
            assert.strictEqual(t.scope.bar, undefined, "scope is empty after clear");
        });

        it("should not affect parent scope.", function() {
            var parent = { foo: "base1", bar:"base2"},
                t = new Template(Object.create(parent), group, render);

            assert.deepEqual(t.scope, {}, "empty scope");
            assert.strictEqual(t.scope.foo, "base1", "got value from parent scope");
            t.add("foo", "value1");
            assert.strictEqual(t.scope.foo, "value1", "got value added");
            t.clear();
            assert.deepEqual(t.scope, {}, "empty scope after clear");
            assert.strictEqual(t.scope.foo, "base1", "got value from parent scope");
            assert.strictEqual(t.scope.bar, "base2", "got value from parent scope");
        });
    });

    // xxx set scope
    // xxx todo write
});
