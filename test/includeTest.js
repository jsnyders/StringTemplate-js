/*global describe, it*/

"use strict";

var assert = require("assert"),
    st = require("../lib/stRuntime"),
    w = require("../lib/autoIndentWriter"),
    testTemplateGroup = require("./include_stg");

// xxx todo compile group first

describe("test group include.stg", function() {

    it("should generate the expected string for template main", function() {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("/main");
        assert.notStrictEqual(t, null, "found a template");
        t.add("arg1", {
            first: "Max",
            last: "Smith"
        });
        t.write(writer);
        assert.strictEqual(writer.toString(), "\n  before [Max], [Smith] after\n", "got expected rendered text");
    });

});
