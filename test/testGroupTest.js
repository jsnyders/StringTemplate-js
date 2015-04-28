/*global describe, it*/

"use strict";

var assert = require("assert"),
    st = require("../lib/stRuntime"),
    w = require("../lib/autoIndentWriter"),
    testTemplateGroup = require("./testGroup.stg");

describe("test group test", function() {

    it("should generate the expected string for main when if condition is false", function() {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("/main");
        assert.notStrictEqual(t, null, "found a template");
        t.add("arg1", {
            first: "Max",
            last: "Smith",
            hasClosing: false
        });
        t.write(writer);
        assert.strictEqual(writer.toString(), "Greeting [Max], [Smith]\nBody\n", "got expected rendered text");
    });

    it("should generate the expected string for main when if condition is true", function() {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("/main");
        assert.notStrictEqual(t, null, "found a template");
        t.add("arg1", {
            first: "A",
            last: "B",
            hasClosing: true,
            closing: "good day"
        });
        t.write(writer);
        assert.strictEqual(writer.toString(), "Greeting [A], [B]\nBody\nClosing good day", "got expected rendered text");
    });
});
