/*global describe, it*/

"use strict";

var assert = require("assert"),
    st = require("../lib/stRuntime"),
    w = require("../lib/autoIndentWriter"),
    helloTemplateGroup = require("./hello.st");

describe("hello world test", function() {

    it("should generate the expected string", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", "world");
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello world!\n", "got expected rendered text");
    });

    it("should generate the expected string with null input", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", null);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello is anyone there?!\n", "got expected rendered text");
    });

    it("should generate the expected string with an array", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", ["Bob", "Sue", "Dan"]);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello BobSueDan!\n", "got expected rendered text");
    });
});
