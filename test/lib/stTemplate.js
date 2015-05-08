/*global describe, it*/

"use strict";

var assert = require("assert"),
    Template = require("../../lib/stTemplate");
    
var group = {};

var render = function(w, c) { return 0; };

describe("stTemplate", function() {

    describe("create template", function() {
        it("should be empty.", function() {
            var t = new Template({}, group, render);

            assert.deepEqual(t.scope, {}, "empty scope");
            assert.strictEqual(t.owningGroup, group, "correct group");
            assert.strictEqual(t.render, render, "correct render function");
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

    // xxx todo write
});
