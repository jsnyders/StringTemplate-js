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
});
