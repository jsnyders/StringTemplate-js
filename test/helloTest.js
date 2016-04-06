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

        t = group.getTemplate("/hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", "world");
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello world!" + writer.eol, "got expected rendered text");
    });

    it("should generate the expected string with null input", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("/hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", null);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello is anyone there?!" + writer.eol, "got expected rendered text");
    });

    it("should generate the expected string with an array", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", ["Bob", "Sue", "Dan"]);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello Bob, Sue, Dan!" + writer.eol, "got expected rendered text");
    });

    it("should generate the expected string with a single item array", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", ["world"]);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello world!" + writer.eol, "got expected rendered text");
    });

    it("should generate the expected string with an empty array", function() {
        var t,
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", []);
        t.write(writer);
        assert.strictEqual(writer.toString(), "Hello !" + writer.eol, "got expected rendered text");
    });

    it("should generate the expected string when there is renderer", function() {
        var t,
            rc = {test: "don't care"},
            group = st.loadGroup(helloTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("hello");
        group.registerAttributeRenderer("string", function(value, fmt, context) {
            assert.strictEqual(fmt, null, "there is no format option");
            assert.strictEqual(context, rc, "the context is correct");
            return value.toUpperCase();
        });
        assert.notStrictEqual(t, null, "found a template");
        t.add("audience", "world");
        t.write(writer, rc);
        assert.strictEqual(writer.toString(), "Hello WORLD!" + writer.eol, "got expected rendered text");
    });
});
