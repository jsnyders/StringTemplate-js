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
            assert.strictEqual(t.argsPassThrough, false, "starts with args pass through false");
        });

        it("should contain any attributes added by name.", function () {
            var t = new Template({}, group, render);

            t.setArgs({arg1: "foo", arg2: "bar"});
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");
            assert.strictEqual(t.argsPassThrough, false, "starts with args pass through false");
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

        it("should allow setting fewer attributes added by position.", function () {
            var t = new Template({}, group, render);

            t.setArgs(["foo"]);
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, undefined, "no value added");
        });

        it("should allow setting fewer attributes by name.", function () {
            var t = new Template({}, group, render);

            t.setArgs({arg2: "bar"});
            assert.strictEqual(t.scope.arg1, undefined, "no value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");
        });

        it("should contain any attributes added by position with pass through.", function () {
            var t = new Template({}, group, render);

            t.setArgs([], true);
            assert.strictEqual(t.scope.arg1, undefined, "no value added"); // note pass through not applied yet
            assert.strictEqual(t.scope.arg2, undefined, "no value added"); // note pass through not applied yet
            assert.strictEqual(t.argsPassThrough, true, "pass through true");
        });

        it("should contain any attributes added by name with pass through.", function () {
            var t = new Template({}, group, render);

            t.setArgs({arg1: "foo"}, true);
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, undefined, "no value added"); // note pass through not applied yet
            assert.strictEqual(t.argsPassThrough, true, "pass through true");
        });

        it("should overwrite when called more than once by position.", function () {
            var t = new Template({}, group, render);

            t.setArgs(["foo", "bar"]);
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");
            t.setArgs(["abc"]);
            assert.strictEqual(t.scope.arg1, "abc", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");

            t.setArgs({arg2: "two"});
            assert.strictEqual(t.scope.arg1, "abc", "got value added");
            assert.strictEqual(t.scope.arg2, "two", "got value added");
        });

        it("should overwrite when called more than once by name.", function () {
            var t = new Template({}, group, render);

            t.setArgs({arg1: "foo", arg2: "bar"});
            assert.strictEqual(t.scope.arg1, "foo", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");

            t.setArgs({arg1: "abc"});
            assert.strictEqual(t.scope.arg1, "abc", "got value added");
            assert.strictEqual(t.scope.arg2, "bar", "got value added");

            t.setArgs(["one", "two"]);
            assert.strictEqual(t.scope.arg1, "one", "got value added");
            assert.strictEqual(t.scope.arg2, "two", "got value added");
        });

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

        it("should clear pass through flag.", function() {
            var t = new Template({}, group, render);

            assert.strictEqual(t.scope.arg1, undefined, "scope is empty");
            assert.strictEqual(t.argsPassThrough, false, "pass through is false");
            t.setArgs(["value1"], true);
            assert.strictEqual(t.scope.arg1, "value1", "got value added");
            assert.strictEqual(t.argsPassThrough, true, "pass through is true");
            t.clear();
            assert.deepEqual(t.scope, {}, "empty scope after clear");
            assert.strictEqual(t.scope.arg1, undefined, "scope is empty after clear");
            assert.strictEqual(t.argsPassThrough, false, "pass through is false");
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

    describe("setScope", function() {
        it("should change the old scope to the new one.", function() {
            var parentOrig = { foo: "base1orig", bar:"base2orig"},
                parentNew = { foo: "base1new", bar:"base2new"},
                t = new Template(Object.create(parentOrig), group, render);

            t.setArgs(["one", "two"]);
            assert.strictEqual(t.scope.foo, "base1orig", "got value from parent scope");
            assert.strictEqual(t.scope.bar, "base2orig", "got value from parent scope");
            assert.strictEqual(t.scope.arg1, "one", "got value added");
            assert.strictEqual(t.scope.arg2, "two", "got value added");
            t.setScope(Object.create(parentNew));
            assert.strictEqual(t.scope.foo, "base1new", "got value from parent scope");
            assert.strictEqual(t.scope.bar, "base2new", "got value from parent scope");
            assert.strictEqual(t.scope.arg1, "one", "got value added");
            assert.strictEqual(t.scope.arg2, "two", "got value added");
        });
    });

    describe("write", function() {
        it("should call render function with writer and context.", function() {
            var t, rfn,
                writer = {},
                context = {},
                rfnCalled = false;

            rfn = function(w, c) {
                assert.strictEqual(w, writer, "render function got correct writer");
                assert.strictEqual(c, context, "render function got correct context");
                rfnCalled = true;
            };

            t = new Template({}, group, rfn);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
        });

        it("should finialize arguments applying defaults.", function() {
            var t, rfn, foo, bar,
                writer = {},
                context = {},
                rfnCalled = false;

            rfn = function(w, c) {
                foo = this.scope.foo;
                bar = this.scope.bar;
                rfnCalled = true;
            };
            rfn.args = [ {name: "foo", default: "X"}, {name: "bar", default: "Y" }];

            t = new Template({}, group, rfn);
            t.setArgs(["A"]);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "A", "render function got correct arg");
            assert.strictEqual(bar, "Y", "render function got correct arg");

            t.clear();
            t.setArgs([]);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "X", "render function got correct arg");
            assert.strictEqual(bar, "Y", "render function got correct arg");

            t.clear();
            t.setArgs({"bar": "Q"});
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "X", "render function got correct arg");
            assert.strictEqual(bar, "Q", "render function got correct arg");
        });

        it("should finialize arguments applying pass through.", function() {
            var t, rfn, foo, bar,
                parentScope = { foo: "base1", bar:"base2"},
                writer = {},
                context = {},
                rfnCalled = false;

            rfn = function(w, c) {
                foo = this.scope.foo;
                bar = this.scope.bar;
                rfnCalled = true;
            };
            rfn.args = [ {name: "foo", default: "X"}, {name: "bar", default: "Y" }];

            t = new Template(Object.create(parentScope), group, rfn);
            t.setArgs(["A"], true);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "A", "render function got correct arg");
            assert.strictEqual(bar, "base2", "render function got correct arg");

            t.clear();
            t.setArgs([], true);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "base1", "render function got correct arg");
            assert.strictEqual(bar, "base2", "render function got correct arg");

            t.clear();
            t.setArgs({"bar": "Q"}, true);
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "base1", "render function got correct arg");
            assert.strictEqual(bar, "Q", "render function got correct arg");

            t.clear();
            t.setArgs({"bar": "Q"}); // note no pass through here
            t.write(writer, context);
            assert.strictEqual(rfnCalled, true, "render function called");
            assert.strictEqual(foo, "X", "render function got correct arg");
            assert.strictEqual(bar, "Q", "render function got correct arg");
        });
    });

});
