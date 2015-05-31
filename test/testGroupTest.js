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
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });


    it("should generate same output as reference implementation for template testLiterals", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testLiterals", {}, function(refOutput) {
            t = group.getTemplate("/testLiterals");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

    it("should generate same output as reference implementation for template testDictionaryAccess", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testDictionaryAccess", {"a": "value of a"}, function(refOutput) {
            t = group.getTemplate("/testDictionaryAccess");
            assert.notStrictEqual(t, null, "found a template");
            t.add("a", "value of a");

            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });
    });

    it("should generate same output as reference implementation for template testDictionaryAccessAlt", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testDictionaryAccessAlt", {"a": "one"}, function(refOutput) {
            t = group.getTemplate("/testDictionaryAccessAlt");
            assert.notStrictEqual(t, null, "found a template");
            t.add("a", "one");

            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");

            writer = w.makeWriter();
            getSTReferenceOutput("testGroup", "testDictionaryAccessAlt", {"a": "two"}, function(refOutput) {
                t = group.getTemplate("/testDictionaryAccessAlt");
                assert.notStrictEqual(t, null, "found a template");
                t.add("a", "two");

                t.write(writer);
                assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
                done();
            });
        });

    });
    
    it("should generate same output as reference implementation for template simple", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "simple", {
            "arg1": {
                "hasTitle": true,
                "title": "Mr",
                "first": "Sam",
                "last": "Smith"
            }
        }, function(refOutput) {
            t = group.getTemplate("/simple");
            assert.notStrictEqual(t, null, "found a template");
            t.add("arg1", {
                "hasTitle": true,
                "title": "Mr",
                "first": "Sam",
                "last": "Smith"
            });
            console.log("xxx ref output: " + refOutput);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");

            writer = w.makeWriter();
            getSTReferenceOutput("testGroup", "simple", {
                "arg1": {
                    "hasTitle": false,
                    "first": "Sam",
                    "last": "Smith"
                }
            }, function(refOutput) {
                t = group.getTemplate("/simple");
                assert.notStrictEqual(t, null, "found a template");
                t.add("arg1", {
                    "hasTitle": false,
                    "first": "Sam",
                    "last": "Smith"
                });
                console.log("xxx ref output: " + refOutput);
                t.write(writer);
                console.log("xxx writer output: " + writer.toString());
                assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
                done();
            });

        });

    });
});
