/*global describe, it*/

"use strict";

var assert = require("assert"),
    path = require("path"),
    st = require("../lib/stRuntime"),
    w = require("../lib/autoIndentWriter"),
    testTemplateGroup = require("./testGroup_stg");

var spawn = require('child_process').spawn;

function getSTReferenceOutput(group, template, data, callback, options) {
    var output = "";
    var errOutput = "";
    var args = (options || []).concat([options || "", group + "." + template]);

    var stst = spawn("stst", args, {
        cwd: path.dirname(module.filename),
        stdio: ["pipe", "pipe", "pipe"]
    });

    stst.stdin.write(JSON.stringify(data));
    stst.stdin.end();

    stst.stdout.on("data", function(data) {
        output += data;
    });

    stst.stderr.on("data", function(data) {
        errOutput += data;
    });

    stst.on("close", function() {
        callback(output, errOutput);
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
            t.setArgs({"a": "value of a"});

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
            t.setArgs({"a": "one"});

            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");

            writer = w.makeWriter();
            getSTReferenceOutput("testGroup", "testDictionaryAccessAlt", {"a": "two"}, function(refOutput) {
                t = group.getTemplate("/testDictionaryAccessAlt");
                assert.notStrictEqual(t, null, "found a template");
                t.setArgs({"a": "two"});

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
            t.setArgs({"arg1": {
                "hasTitle": true,
                "title": "Mr",
                "first": "Sam",
                "last": "Smith"
            }});
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
                t.setArgs({"arg1": {
                    "hasTitle": false,
                    "first": "Sam",
                    "last": "Smith"
                }});
                t.write(writer);
                assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
                done();
            });

        });

    });

    it("should generate same output as reference implementation for template testArgsCaller with no args passed in", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testArgsCaller", {}, function(refOutput, errors) {
            t = group.getTemplate("/testArgsCaller");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            console.log("xxx errors: " + errors);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            // xxx need to verify runtime errors and results separately 
            // xxx pass throught not yet hooked up
            // xxx seems to be a difference with extra new line
            done();
        });

    });

    it("should generate same output as reference implementation for template testMap", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter({lineWidth: 20});

        getSTReferenceOutput("testGroup", "testMap", {list: ["apple", "banana", null, "orange"]}, function(refOutput, errors) {
            t = group.getTemplate("/testMap");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            console.log("xxx errors: " + errors);
            t.setArgs([["apple", "banana", null, "orange"]]);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        }, [ "-w", "20"]);

    });

    it("should generate same output as reference implementation for template testMapRot", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testMapRot", {board: ["x", " ", "X", "O", "O", "X", " ", " ", " "]}, function(refOutput, errors) {
            t = group.getTemplate("/testMapRot");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.setArgs({board:["x", " ", "X", "O", "O", "X", " ", " ", " "]});
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

    it("should generate same output as reference implementation for template testPropIndirect", function(done) {
        var t,
            attrs = {names: [
                    {last: "Smith", first: "Max"}, 
                    {last: "Jones", first: "Sam"}
                ], propName: "last"},
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testPropIndirect", attrs, function(refOutput, errors) {
            t = group.getTemplate("/testPropIndirect");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.setArgs(attrs);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

    it("should generate same output as reference implementation for template testIncludeIndirect", function(done) {
        var t,
            attrs = {},
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testIncludeIndirect", attrs, function(refOutput, errors) {
            t = group.getTemplate("testIncludeIndirect");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.setArgs(attrs);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

    it("should generate same output as reference implementation for template testNestedPropRef", function(done) {
        var t,
            attrs = {"deep": { "level1": { "things": {"stuff": "gold", "junk": "lemon" }}}},
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testNestedPropRef", attrs, function(refOutput, errors) {
            t = group.getTemplate("/testNestedPropRef");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.setArgs(attrs);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

    it("should generate same output as reference implementation for template testEmptyTemplates", function(done) {
        var t,
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testEmptyTemplates", {}, function(refOutput, errors) {
            t = group.getTemplate("/testEmptyTemplates");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });
    });

    it("should generate same output as reference implementation for template testZipMap", function(done) {
        var t,
            data = {
                "zipC1": ["obj1", "thing", "obj2", "obj2"],
                "zipC2": [ "p1", "wrench", "x", "p2"],
                "zipC3": [ "apple", "10092", "foo"]
            },
            group = st.loadGroup(testTemplateGroup),
            writer = w.makeWriter();

        getSTReferenceOutput("testGroup", "testZipMap", data, function(refOutput, errors) {
            t = group.getTemplate("/testZipMap");
            assert.notStrictEqual(t, null, "found a template");
            // there are no arguments

            t.setArgs(data);
            t.write(writer);
            assert.strictEqual(writer.toString(), refOutput, "got expected rendered text");
            done();
        });

    });

});
