/*global describe, it*/

"use strict";

var assert = require("assert"),
    group = require("../../compiler/group");

describe("group - compiler group context", function() {

    describe("global constants", function() {
        it("should have constant values", function() {
            assert.strictEqual(group.TEMPLATE_FILE_EXTENSION, ".st", "template file extension has correct default");
            assert.strictEqual(group.GROUP_FILE_EXTENSION, ".stg", "group file extension has correct default");
            assert.strictEqual(group.DEFAULT_START_DELIMITER, "$", "default start delimiter has correct default");
            assert.strictEqual(group.DEFAULT_STOP_DELIMITER, "$", "default stop delimiter has correct default");
        });
    });

    describe("makeGroup", function() {
        it("should init with raw arg", function() {
            var g = group.makeGroup("/foo/bar", "mygroup", true);

            assert.strictEqual(g.fileName, "mygroup", "has correct fileName");
            assert.strictEqual(g.groupFolder, "/foo/bar", "has correct groupFolder");
            assert.strictEqual(g.raw, true, "has correct raw property");
        });

        it("should init without raw arg", function() {
            var g = group.makeGroup("a", "b");

            assert.strictEqual(g.fileName, "b", "has correct fileName");
            assert.strictEqual(g.groupFolder, "a", "has correct groupFolder");
            assert.strictEqual(g.raw, false, "has correct raw property");
        });

        it("should init various collections", function() {
            var g = group.makeGroup("", "");
            assert.deepEqual(g.templates, {}, "has empty templates");
            assert.deepEqual(g.aliases, {}, "has empty aliases");
            assert.deepEqual(g.imports, [], "has empty imports array");
            assert.deepEqual(g.aliases, {}, "has empty dictionaries");
        });

        it("should add templates", function() {
            var result,
                g = group.makeGroup("a/b", ""),
                template = {name: "foo"};

            result = g.addTemplate( template );
            assert.strictEqual(g.templates["a/b/foo"], template, "template was added with correct name");
            assert.strictEqual(result, null, "result is null");
        });

        it("should add regions", function() {
            var result,
                g = group.makeGroup("", ""),
                template = {name: "foo", enclosingTemplate: "bar"};

            result = g.addRegion( template );
            assert.strictEqual(g.templates["@bar.foo"], template, "region template was added with correct name");
            assert.strictEqual(result, null, "result is null");
        });

        it("should add template alias", function() {
            var result,
                g = group.makeGroup("", ""),
                template = {name: "foo"};

            g.addTemplate( template );
            result = g.addTemplateAlias("bar", "foo");
            assert.strictEqual(g.aliases["bar"], "foo", "alisa was added");
            assert.strictEqual(result, null, "result is null");
        });

        it("should add imports", function() {
            var result,
                g = group.makeGroup("", "");

            g.addImports("first.stg");
            result = g.addImports("second.stg");

            assert.strictEqual(g.imports[0], "first.stg", "import added in correct order");
            assert.strictEqual(g.imports[1], "second.stg", "import added in correct order");
            assert.strictEqual(result, null, "result is null");
        });

        it("should add dictionaries", function() {
            var result,
                g = group.makeGroup("", ""),
                dictionary = {name: "foo"};

            result = g.addDictionary( dictionary );
            assert.strictEqual(g.dictionaries["foo"], dictionary, "dictionary was added with correct name");
            assert.strictEqual(result, null, "result is null");
        });

    });

    describe("makeGroup.isFunction", function() {
        it("should identify all valid functions", function () {
            var g = group.makeGroup("", "");

            assert.strictEqual(g.isFunction("first"), true, "first is a valid function");
            assert.strictEqual(g.isFunction("length"), true, "length is a valid function");
            assert.strictEqual(g.isFunction("strlen"), true, "strlen is a valid function");
            assert.strictEqual(g.isFunction("last"), true, "last is a valid function");
            assert.strictEqual(g.isFunction("rest"), true, "rest is a valid function");
            assert.strictEqual(g.isFunction("reverse"), true, "reverse is a valid function");
            assert.strictEqual(g.isFunction("trunc"), true, "trunc is a valid function");
            assert.strictEqual(g.isFunction("strip"), true, "strip is a valid function");
            assert.strictEqual(g.isFunction("trim"), true, "trim is a valid function");
        });

        it("should identify invalid functions", function () {
            var g = group.makeGroup("", "");

            assert.strictEqual(g.isFunction("foo"), false, "foo is not a valid function");
            assert.strictEqual(g.isFunction(""), false, "empty string is not a valid function");
            assert.strictEqual(g.isFunction(), false, "undefined is not a valid function");
            assert.strictEqual(g.isFunction("prototype"), false, "prototype is not a valid function");
        });
    });

    describe("makeGroup.isValidOption", function() {
        it("should identify all valid options", function () {
            var g = group.makeGroup("", "");

            assert.strictEqual(g.isValidOption("separator"), true, "separator is a valid option");
            assert.strictEqual(g.isValidOption("format"), true, "format is a valid option");
            assert.strictEqual(g.isValidOption("null"), true, "null is a valid option");
            assert.strictEqual(g.isValidOption("wrap"), true, "wrap is a valid option");
            assert.strictEqual(g.isValidOption("anchor"), true, "anchor is a valid option");
        });

        it("should identify invalid options", function () {
            var g = group.makeGroup("", "");

            assert.strictEqual(g.isValidOption("foo"), false, "foo is not a valid option");
            assert.strictEqual(g.isValidOption(""), false, "empty string is not a valid option");
            assert.strictEqual(g.isValidOption(), false, "undefined is not a valid option");
            assert.strictEqual(g.isValidOption("prototype"), false, "prototype is not a valid option");
        });
    });

    describe("makeGroup.defaultOptionValue", function() {
        it("should return value for anchor", function () {
            var g = group.makeGroup("", "");

            assert.deepEqual(g.defaultOptionValue("anchor"), { type: "BOOLEAN", value: true }, "default value for anchor");
        });

        it("should return value for wrap", function () {
            var g = group.makeGroup("", "");

            assert.deepEqual(g.defaultOptionValue("wrap"), { type: "STRING", value: "\n" }, "default value for wrap");
        });

        it("should return null for other options", function () {
            var g = group.makeGroup("", "");

            assert.strictEqual(g.defaultOptionValue("format"), null, "no default value for format");
            assert.strictEqual(g.defaultOptionValue("bad"), null, "no default value for bad option");
        });
    }); 

});
