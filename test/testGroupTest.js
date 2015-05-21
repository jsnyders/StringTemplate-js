/*global describe, it*/

"use strict";

var assert = require("assert"),
    path = require("path"),
    st = require("../lib/stRuntime"),
    w = require("../lib/autoIndentWriter"),
    testTemplateGroup = require("./testGroup_stg");

var spawn = require('child_process').spawn;

function getSTReferenceOutput(group, template, data, callback) {
    var output = "";
    var stst = spawn("stst", [group + "." + template], {
        cwd: path.dirname(module.filename),
        stdio: ["pipe", "pipe", "pipe"]
    });

    stst.stdin.write(JSON.stringify(data));
    stst.stdin.end();

    stst.stdout.on("data", function(data) {
        output += data;
    });

    stst.stderr.on("data", function(data) {
        output += data;
    });

    stst.on("close", function() {
        callback(output);
    });
}

describe("test group test", function() {

    it("should generate same output as reference implementation for template testEscapes", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testEscapes", {}, function(refOutput) {
            t = group.getTemplate("/testEscapes");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.write(writer);
            console.log("xxx ref: " + refOutput);

            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

/*xxx
    it("xxx should generate the expected string for main when if condition is false", function() {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        t = group.getTemplate("/main");
        assert.notStrictEqual(t, null, "found a template");
        t.add("names",  [
            {
                "first": "Max",
                "last": "Smith",
                "hasTitle": false
            },
            {
                "first": "Dan",
                "last": "Jones",
                "hasTitle": true,
                "title": "Dr."
            }
        ]);
        t.add("conditions", {
            "c1": true,
                "c2": 0,
                "c3": null,
                "c4": false,
                "c5": "value"
        });

        try {
            t.write(writer);
        } catch(ex) {
            console.log("xxx output up to error: " + writer.toString());
            throw ex;
        }
        
        assert.strictEqual(writer.toString(), "Greeting [Max], [Smith]\nBody\n", "got expected rendered text");
    });
xxx */
});
